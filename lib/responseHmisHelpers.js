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
    const appid = config.appId;
    const surveyDetails = surveys.findOne({ _id: response.surveyID });
    if (surveyDetails.apiSurveyServiceId) {
      // it's Id exists, just upload responses.
      // Getting Survey Id.
      const surveyId = surveyDetails.apiSurveyServiceId;
      responseHmisHelpers.sendResponses(clientId, surveyId, appid, response.section);
      callback();
    } else {
      // survey Id doesn't exist, upload survey first.
    }
  },
  sendResponses(clientId, surveyId, appid, sections) {
    for (let i = 0; i < sections.length; i += 1) {
      // Getting Section Id from Hmis.
      const sectionCurrent = sections[i];
      const sectionDetails =
        surveyQuestionsMaster.findOne({ _id: sectionCurrent.sectionID });
      const sectionid = sectionDetails.apiSurveyServiceId;
      for (let j = 0; j < sectionCurrent.response.length; j += 1) {
        const responseCurrent = sectionCurrent.response[j];
        const responseText = responseCurrent.answer;
        const questionDetails = questions.findOne({ _id: responseCurrent.questionID });
        if (questionDetails.dataType !== 'label') {
          const questionId = questionDetails.surveyServiceQuesId;
          // Send to API.
          logger.info(`${questionId} - ${responseText}`);
          Meteor.call('sendResponse', clientId, surveyId, appid, sectionid, questionId,
            responseText, (err, res) => {
              if (err) {
                logger.error(`SendResponse Error ${err}`);
              } else {
                logger.info(`${JSON.stringify(res)}`);
                // Can save response Ids later if needed.
              }
            });
        }
      }
    }
  },
};
