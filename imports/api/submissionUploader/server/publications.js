import SubmissionUploaderSurveyConfigs from
  '/imports/api/submissionUploader/submissionUploaderSurveyConfigs';
import SubmissionUploaderFiles from
  '/imports/api/submissionUploader/submissionUploaderFiles';
import Jobs from '/imports/api/jobs/jobs';
import { logger } from '/imports/utils/logger';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Meteor.publish('submissionUploader.all', function publishSubmissionUploaderFiles() {
  logger.info(`PUB[${this.userId}]: submissionUploaderFiles.all`);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }
  return SubmissionUploaderFiles.find();
});

Meteor.publish('submissionUploader.jobs', function publishSubmissionUploaderJobs() {
  logger.info(`PUB[${this.userId}]: submissionUploaderJobs.all`);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }
  return Jobs.find();
});

Meteor.publish('surveyConfigs.all', function publishAllSurveyConfigs() {
  logger.info(`PUB[${this.userId}]: submissionUploaderSurveyConfigs.all`);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }
  return SubmissionUploaderSurveyConfigs.find();
});

Meteor.publish('surveyConfigs.one', function publishSurveyConfig(surveyId) {
  logger.info(`PUB[${this.userId}]: submissionUploaderSurveyConfigs.one`);
  check(surveyId, String);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }
  return SubmissionUploaderSurveyConfigs.find({ _id: surveyId });
});
