import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import Jobs, { JobStatus } from '/imports/api/jobs/jobs';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import SubmissionUploaderSurveyConfigs from
  '/imports/api/submissionUploader/submissionUploaderSurveyConfigs';
import {
  ClientMatcher,
  ResponseMapper,
  SubmissionUploader,
  createRowProcessor,
} from '/imports/api/submissionUploader/rowProcessor';
import {
  createQueue,
  onRowCompleted,
  onRowFailed,
} from '/imports/api/submissionUploader/submissionUploaderProcessor';
import SubmissionUploaderFiles from './submissionUploaderFiles';

Meteor.methods({
  'submissionUploader.addJob'(jobName, queueName, row) {
    check(jobName, String);
    check(queueName, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    return Jobs.insert({
      name: jobName,
      queue: queueName,
      data: {
        row,
      },
    });
  },
  'submissionUploader.run'(surveyId, queueName) {
    logger.info(`METHOD[${this.userId}]: submissionUploader.run`, surveyId, queueName);
    check(surveyId, String);
    check(queueName, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const surveyConfig = SubmissionUploaderSurveyConfigs.findOne(surveyId).definition;

    if (!surveyConfig) {
      throw new Meteor.Error(400, 'Survey config does not exist');
    }

    const clientApi = hc.api('client');
    const surveyApi = hc.api('survey');

    const clientMatcher = new ClientMatcher({ surveyConfig, clientApi });
    const submissionMapper = new ResponseMapper({ surveyConfig });
    const submissionUploader = new SubmissionUploader({ surveyApi });

    const jobProcessor = createRowProcessor({
      surveyId,
      clientMatcher,
      submissionMapper,
      submissionUploader,
      jobsStore: Jobs,
    });
    const onJobCompleted = onRowCompleted({
      jobsStore: Jobs,
    });
    const onJobFailed = onRowFailed({
      jobsStore: Jobs,
    });

    const queue = createQueue({ jobProcessor, onJobCompleted, onJobFailed });

    queue.on('drain', () => {
      logger.info(`Done processing queue ${queueName}`);
    });

    const jobs = Jobs.find({ queue: queueName }).fetch();

    if (jobs.length) {
      logger.info(`Starting queue ${queueName}, ${jobs.length} jobs`);
      jobs.map(job => queue.push({
        id: job._id,
        data: job.data.row,
      }));
      jobs.map(job => Jobs.update(job._id, { $set: { status: JobStatus.PENDING } }));
    } else {
      logger.warn(`Queue ${queueName} has no jobs`);
    }
    return jobs.length;
  },

  'submissionUploader.updateConfig'(surveyId, definition) {
    logger.info(`METHOD[${this.userId}]: submissionUploader.updateConfig`, surveyId, definition);
    check(surveyId, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    return SubmissionUploaderSurveyConfigs.upsert(surveyId, { definition });
  },

  'submissionUploader.createFile'(surveyId, name) {
    logger.info(`METHOD[${this.userId}]: submissionUploader.createFile`, surveyId, name);
    check(surveyId, String);
    check(name, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    return SubmissionUploaderFiles.insert({
      uploadedBy: this.userId,
      surveyId,
      name,
      failedRows: 0,
      totalRows: 0,
      processedRows: 0,
    });
  },

  'submissionUploader.setTotalRows'(fileId, totalRows) {
    logger.info(`METHOD[${this.userId}]: submissionUploader.setTotalRows`, fileId, totalRows);
    check(fileId, String);
    check(totalRows, Number);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    return SubmissionUploaderFiles.update(fileId, { $set: { totalRows } });
  },

  'submissionUploader.parseUploadRow'(submissionId, fileId, index, row) {
    // NB: Logging disabled because it's ineffective for big files:
    // logger.info(`METHOD[${this.userId}]: submissionUploader.parseUploadRow`,
    //   submissionId, fileId, index);
    check(submissionId, String);
    check(index, Number);
    check(fileId, String);
    check(row, Array);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    return Jobs.insert({
      status: JobStatus.IDLE,
      name: `${fileId}-${index}`,
      queue: fileId,
      data: {
        submissionId,
        uploadedBy: this.userId,
        row,
      },
    });
  },
});
