import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';
import Responses from '/imports/api/responses/responses';


Meteor.methods({
  sendResponse(clientId, surveyId, responses) {
    logger.info(`METHOD[${Meteor.userId()}]: sendResponse`, clientId, surveyId, responses);
    const hc = HmisClient.create(Meteor.userId());
    // will send all at one time.
    return hc.api('survey').sendResponses(clientId, surveyId, responses);
  },

  updateSubmissionIdForResponses(_id, submissionId) {
    logger.info(`METHOD[${Meteor.userId()}]: updateSubmissionIdForResponses`, _id, submissionId);
    Responses.update(_id, { $set: { submissionId } });
  },
  updateResponseStatus(_id, responsestatus) {
    logger.info(`METHOD[${Meteor.userId()}]: updateResponseStatus`, _id, responsestatus);
    Responses.update(_id, { $set: { responsestatus } });
  },

  uploadResponse(responseId) {
    logger.info(`METHOD[${Meteor.userId()}]: uploadResponse`, responseId);
    this.unblock();
    // Checking if SPDAT or HUD. If SPDAT, then only upload.
    try {
      const response = Responses.findOne({ _id: responseId });
      const survey = Surveys.findOne({ _id: response.surveyID });
      if (survey.stype !== 'hud') {
        Meteor.call('updateResponseStatus', responseId, 'Uploading');

        logger.debug('sending response to HMIS', responseId);
        const sendResponseToHmisSync = Meteor.wrapAsync(
          responseHmisHelpers.sendResponseToHmis);
        const res = sendResponseToHmisSync(responseId, {}, true);

        if (res) {
          logger.debug('calculating response score', responseId);
          // Calculate the scores now and send them too.
          let score;
          // Send response Id, survey Id and fromDb to true to score helpers.
          switch (survey.stype) {
            case 'spdat-t':
              score = spdatScoreHelpers.calcSpdatTayScore(survey._id, responseId, true);
              // upload the scores too.
              break;
            case 'spdat-f':
              score = spdatScoreHelpers.calcSpdatFamilyScore(survey._id, responseId, true);
              break;
            case 'spdat-s':
              score = spdatScoreHelpers.calcSpdatSingleScore(survey._id, responseId, true);
              break;
            default:
              score = 0;
              // Should be other than VI-SPDAT.
              break;
          }
          // On getting the scores, update them.
          logger.debug('sending score to HMIS', responseId, score);

          Meteor.call('sendScoresToHMIS', survey.apiSurveyServiceId,
                                  response.clientID, score);

          // save the submission Id.
          logger.debug('updating submission id', responseId);
          Meteor.call('updateSubmissionIdForResponses', responseId, res.submissionId);
        } else {
          throw new Meteor.Error('Error sending Response to Hmis');
        }
      } else {
        throw new Meteor.Error('Response upload for HUD not implemented');
      }
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      // TODO: ???
      Meteor.call('updateResponseStatus', responseId, 'Completed');
    }
  },
});
