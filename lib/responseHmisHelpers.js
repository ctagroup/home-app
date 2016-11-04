/**
 * Created by Mj on 9/30/2016.
 */

responseHmisHelpers = {
  sendResponseToHmis(_id, callback) {
    // TODO assuming for now that client exists in HMIS. Do check for that in future.
    const response = responses.findOne({ _id });
    logger.info(`response Mongo Id: ${_id}`);
    // Getting Client Id.
    const clientId = response.clientID;
    // Getting App Id.
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const appId = config.appId;
    const surveyDetails = surveys.findOne({ _id: response.surveyID });
    if (surveyDetails.apiSurveyServiceId) {
      // it's Id exists, just upload responses.
      // Getting Survey Id.
      const surveyId = surveyDetails.apiSurveyServiceId;
      responseHmisHelpers.sendResponses(clientId, surveyId, appId, response.section, (result) => {
        // Add id to local response.
        callback(result);
      });
    } else {
      // survey Id doesn't exist, upload survey first.
      // Show warning here.
      logger.error('Survey Not uploaded');
    }
  },
  sendResponses(clientId, surveyId, appId, sections, callback) {
    const responses = { responses: [] };
    for (let i = 0; i < sections.length; i += 1) {
      // Getting Section Id from Hmis.
      const sectionCurrent = sections[i];
      const sectionDetails =
        surveyQuestionsMaster.findOne({ _id: sectionCurrent.sectionID });
      if (!sectionDetails.apiSurveyServiceId) {
        // Show an error
        logger.error(`Section '${sectionDetails.content}' not uploaded!`);
      } else {
        const sectionId = sectionDetails.apiSurveyServiceId;
        for (let j = 0; j < sectionCurrent.response.length; j += 1) {
          const responseCurrent = sectionCurrent.response[j];
          const responseText = responseCurrent.answer;
          const questionDetails = questions.findOne({ _id: responseCurrent.questionID });
          if (questionDetails.dataType !== 'label') {
            const questionId = questionDetails.surveyServiceQuesId;
            // Send to API.
            if (!questionId) {
              // produce an error.
            } else {
              logger.info(`${questionId} - ${responseText}`);
              const temp = { questionId, responseText, sectionId, appId };
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
        callback(false);
      }
      // Return the submission Id here, or return it.
      callback(res);
    });
  },
};
