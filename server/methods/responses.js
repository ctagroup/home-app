/**
 * Created by Mj on 10/1/2016.
 */

Meteor.methods(
  {
    sendResponse(clientId, surveyId, responses) {
      // will send all at one time.
      return HMISAPI
        .addResponseToHmis(clientId, surveyId, responses);
    },
    updateSubmissionIdForResponses(_id, submissionId) {
      responses.update(_id, { $set: { submissionId } });
      logger.info('Response Submission Id Added to mongo');
    },
    updateResponseStatus(_id, responsestatus) {
      responses.update(_id, { $set: { responsestatus } });
    },
  }
);
