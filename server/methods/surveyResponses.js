/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    addSurveyResponse(surveyID, clientID, audience, userID, mainSectionObject, status) {
      const responsesCollection = HomeUtils.adminCollectionObject('responses');
      const responseRecords = responsesCollection.insert(
        {
          clientID,
          audience,
          surveyID,
          userID,
          responsestatus: status,
          section: mainSectionObject,
        }
      );
      return responseRecords;
    },
    updateSurveyResponse(responseID, surveyID, clientID, userID, mainSectionObject, status) {
      const responsesCollection = HomeUtils.adminCollectionObject('responses');
      const responseRecords = responsesCollection.update(
        {
          _id: responseID,
        }, {
          $set: {
            clientID,
            surveyID,
            userID,
            responsestatus: status,
            section: mainSectionObject,
          },
        }
      );
      return responseRecords;
    },
  }
);
