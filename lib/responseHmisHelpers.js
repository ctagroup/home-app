import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';
import Questions from '/imports/api/questions/questions';
import Responses from '/imports/api/responses/responses';


responseHmisHelpers = {
  sendResponseToHmis(_id, responseToSend = {}, fromDb = false, callback) {
    // ResponseToSend is added because the data just added to mongo was not being retrieved.
    // TODO assuming for now that client exists in HMIS. Do check for that in future.
    if (fromDb) {
      const response = Responses.findOne({ _id });
      logger.info('response doc Mongo:', response);
      // Getting Client Id.
      const clientId = response.clientID;
      const surveyDetails = Surveys.findOne({ _id: response.surveyID });
      if (surveyDetails.apiSurveyServiceId) {
        // it's Id exists, just upload responses.
        // Getting Survey Id.
        const surveyId = surveyDetails.apiSurveyServiceId;
        responseHmisHelpers.sendResponses(clientId, surveyId, response.section, (err, result) => {
          // Add id to local response.
          logger.debug('..');
          logger.debug('sendResponseToHmis: responseHmisHelpers.sendResponses err', err);
          logger.debug('sendResponseToHmis: responseHmisHelpers.sendResponses res', result);
          logger.debug('..');
          callback(err, result);
        });
      } else {
        // survey Id doesn't exist, upload survey first.
        // Show warning here.
        logger.error(`Survey Id does not exist: ${response.surveyID}`);
        throw new Meteor.Error('home', `Survey Id does not exist: ${response.surveyID}`);
      }
    } else {
      logger.info(`response: ${JSON.stringify(responseToSend, null, 2)}`);
      // Getting Client Id.
      const clientId = responseToSend.clientID;
      const surveyDetails = Surveys.findOne({ _id: responseToSend.surveyID });
      if (surveyDetails.apiSurveyServiceId) {
        // it's Id exists, just upload responses.
        // Getting Survey Id.
        const surveyId = surveyDetails.apiSurveyServiceId;
        responseHmisHelpers.sendResponses(clientId, surveyId, responseToSend.section, (err, result) => { // eslint-disable-line max-len
          // Add id to local response.
          callback(err, result);
        });
      } else {
        // survey Id doesn't exist, upload survey first.
        // Show warning here.
        logger.error(`Survey Id does not exist: ${responseToSend.surveyID}`);
        throw new Meteor.Error('home', `Survey Id does not exist: ${responseToSend.surveyID}`);
      }
    }
  },
  sendResponses(clientId, surveyId, sections, callback) {
    const responses = { responses: [] };
    for (let i = 0; i < sections.length; i += 1) {
      // Getting Section Id from Hmis.
      const sectionCurrent = sections[i];
      const sectionDetails = SurveyQuestionsMaster.findOne({ _id: sectionCurrent.sectionID });
      logger.debug('sendResponses', sectionDetails);

      if (!sectionDetails) {
        logger.debug('SurveyQuestionsMaster not found', sectionCurrent);
        throw new Meteor.Error(`SurveyQuestionsMaster not found ${sectionCurrent.sectionID}`);
      }

      if (!sectionDetails.apiSurveyServiceId) {
        // Show an error
        logger.error(`Section '${sectionDetails.content}' not uploaded!`);
        throw new Meteor.Error('home', `Section '${sectionDetails.content}' not uploaded!`);
      } else {
        const sectionId = sectionDetails.apiSurveyServiceId;
        for (let j = 0; sectionCurrent.skip === false &&
              j < sectionCurrent.response.length; j += 1) {
          const responseCurrent = sectionCurrent.response[j];
          const responseText = responseCurrent.answer;
          const questionDetails = Questions.findOne({ _id: responseCurrent.questionID });
          if (questionDetails.dataType !== 'label') {
            const questionId = questionDetails.surveyServiceQuesId;
            // Send to API.
            if (!questionId) {
              // produce an error.
            } else {
              logger.info(`${questionId} - ${responseText}`);
              const temp = { questionId, responseText, sectionId };
              responses.responses.push(temp);
            }
          }
        }
      }
    }
    // now send all at once.
    Meteor.call('sendResponse', clientId, surveyId, responses, (err, res) => {
      if (err) {
        logger.error(`SendResponse Error ${err}`);
        callback(err);
      }
      // Return the submission Id here, or return it.
      callback(null, res);
    });
  },
};
