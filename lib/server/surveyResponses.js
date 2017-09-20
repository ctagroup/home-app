import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import Responses from '/imports/api/responses/responses';

Meteor.methods(
  {
    addSurveyResponse(
      surveyID,
      clientID,
      isHMISClient,
      clientSchema,
      userID,
      mainSectionObject,
      status
    ) {
      const responseRecords = Responses.insert(
        {
          clientID,
          isHMISClient,
          clientSchema,
          surveyID,
          userID,
          responsestatus: status,
          section: mainSectionObject,
        }
      );
      return responseRecords;
    },
    updateSurveyResponse(
      responseID,
      surveyID,
      clientID,
      isHMISClient,
      clientSchema,
      userID,
      mainSectionObject,
      status
    ) {
      const responseRecords = Responses.update(
        {
          _id: responseID,
        }, {
          $set: {
            clientID,
            isHMISClient,
            clientSchema,
            surveyID,
            userID,
            responsestatus: status,
            section: mainSectionObject,
          },
        }
      );
      return responseRecords;
    },
    sendScoresToHMIS(surveyId, clientId, score) {
      const hc = HmisClient.create(Meteor.userId());
      // Send scores section-wise here.
      for (let i = 0; i < score.length; i += 1) {
        const sectionId = score[i].sectionId;
        if (!sectionId) {
          logger.warn(`sendScoresToHMIS: section[${i}].sectionId is empty`, surveyId, clientId);
        } else {
          const sectionScore = { sectionScore: score[i].sectionScore };
          hc.api('survey').createSectionScores(surveyId, clientId, sectionId, sectionScore);
        }
      }
    },
    deleteOldScores(surveyId, clientId) {
      const hc = HmisClient.create(Meteor.userId());
      return hc.api('survey').deleteSurveyScores(surveyId, clientId);
    },

    removeSurveyResponse(responseId) {
      check(responseId, String);
      const response = Responses.findOne(responseId);
      const canBeRemoved = true;
      if (!response) {
        throw new Meteor.Error(404, 'Response does not exists');
      }
      if (!canBeRemoved) {
        throw new Meteor.Error(403, 'You are not authorized to remove this response');
      }
      Responses.remove(responseId);
    },
  }
);
