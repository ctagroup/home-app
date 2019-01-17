import SubmissionUploaderSurveyConfigs from
  '/imports/api/submissionUploader/submissionUploaderSurveyConfigs';
import SubmissionUploaderFiles from
  '/imports/api/submissionUploader/submissionUploaderFiles';
import Jobs from '/imports/api/jobs/jobs';
import { logger } from '/imports/utils/logger';

Meteor.publish('submissionUploader.all', function publishSubmissionUploaderFiles() {
  logger.info(`PUB[${this.userId}]: submissionUploaderFiles.all`);
  if (!this.userId) return [];
  return SubmissionUploaderFiles.find();
});

Meteor.publish('submissionUploader.jobs', function publishSubmissionUploaderJobs() {
  logger.info(`PUB[${this.userId}]: submissionUploaderJobs.all`);
  if (!this.userId) return [];
  return Jobs.find();
});

// TODO: check permissions?
Meteor.publish('surveyConfigs.all', function publishAllSurveyConfigs() {
  logger.info(`PUB[${this.userId}]: submissionUploaderSurveyConfigs.all`);
  if (!this.userId) return [];
  return SubmissionUploaderSurveyConfigs.find();
});

Meteor.publish('surveyConfigs.one', function publishSurveyConfig(surveyId) {
  logger.info(`PUB[${this.userId}]: submissionUploaderSurveyConfigs.one`);
  if (!this.userId) return [];
  return SubmissionUploaderSurveyConfigs.find({ _id: surveyId });
});
