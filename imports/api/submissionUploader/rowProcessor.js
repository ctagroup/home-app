export function createRowProcessor({ surveyId, clientMatcher,
  submissionMapper, submissionUploader }) {
  const processFn = (job, cb) => {
    try {
      const row = job.data;
      const clientId = clientMatcher.matchRowToClient(row);
      const responses = submissionMapper.mapRowToResponse(row);
      const submissionId = submissionUploader.uploadSubmission(surveyId, clientId, responses);
      cb(null, {
        clientId,
        submissionId,
      });
    } catch (err) {
      cb(err);
    }
  };
  return Meteor.bindEnvironment(processFn);
}
