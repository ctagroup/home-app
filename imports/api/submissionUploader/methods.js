import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import Jobs, { JobStatus } from '/imports/api/jobs/jobs';
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

import SubmissionUploaderFixtures from '/imports/__tests__/fixtures/submissionUploader';
import SubmissionUploaderFiles from './submissionUploaderFiles';

Meteor.methods({
  'submissionUploader.prepopulateWithTestData'() {
    const definition = SubmissionUploaderFixtures.getSurveyDefinitionWithRealQuestionIds();
    const row = SubmissionUploaderFixtures.getSurvey1Row();
    SubmissionUploaderSurveyConfigs.upsert('4b79f42f-e793-4be4-a35f-4b7b56f14572', {
      definition,
    });
    Jobs.remove({ queue: 'file1' });
    Meteor.call('submissionUploader.addJob', 'job #1', 'file1', row);

    const SOURCE_SYSTEM_ID_INDEX = 1;
    row[SOURCE_SYSTEM_ID_INDEX] = -1; // strangely, -1 gets matched to a client
    Meteor.call('submissionUploader.addJob', 'job #2', 'file1', row);

    // Run the queue using:
    // Meteor.call('submissionUploader.run', '4b79f42f-e793-4be4-a35f-4b7b56f14572',
    //   'file1', function (err, res) { console.log(err,res) })
  },
  'submissionUploader.addJob'(jobName, queueName, row) {
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

    if (!this.userId) {
      // TODO: check user role
      throw new Meteor.Error(401, 'Unauthorized');
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
    return SubmissionUploaderSurveyConfigs.upsert(surveyId, { definition });
  },
  'submissionUploader.createFile'(surveyId, name) {
    logger.info(`METHOD[${this.userId}]: submissionUploader.createFile`, surveyId, name);

    if (!this.userId) {
      // TODO: check user role
      throw new Meteor.Error(401, 'Unauthorized');
    }
    return SubmissionUploaderFiles.insert({
      uploadedBy: this.userId,
      surveyId,
      name,
    });
  },
  'submissionUploader.setTotalRows'(fileId, totalRows) {
    return SubmissionUploaderFiles.update(fileId, { $set: { totalRows } });
  },
  'submissionUploader.parseUploadRow'(submissionId, fileId, index, row) {
    // NB: Logging disabled because it's ineffective for big files:
    // logger.info(`METHOD[${this.userId}]: submissionUploader.parseUploadRow`,
    //   submissionId, fileId, index);
    check(row, Array);
    if (!this.userId) {
      // TODO: check user role
      throw new Meteor.Error(401, 'Unauthorized');
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
