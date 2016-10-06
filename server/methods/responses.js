/**
 * Created by Mj on 10/1/2016.
 */

Meteor.methods(
  {
    sendResponse(clientId, surveyId, appid, sectionid, questionId, responseText) {
      // will send one at a time.
      return HMISAPI
        .addResponseToHmis(clientId, surveyId, appid, sectionid, questionId, responseText);
    },
  }
);
