import SubmissionUploaderSurveyConfigs from
  '/imports/api/submissionUploader/submissionUploaderSurveyConfigs';
import SubmissionUploaderFiles from
  '/imports/api/submissionUploader/submissionUploaderFiles';
import { logger } from '/imports/utils/logger';

Meteor.publishComposite('submissionUploader.all', () => {
  logger.info(`PUB[${this.userId}]: submissionUploaderFiles.all`);
  if (!this.userId) return [];
  return SubmissionUploaderFiles.find();
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
