/* eslint prefer-arrow-callback: "off", func-names: "off", no-unused-expressions: "off" */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import Jobs, { JobStatus } from '/imports/api/jobs/jobs';
// import SubmissionUploaderFiles from './submissionUploaderFiles';
import SubmissionUploaderSurveyConfigs from './submissionUploaderSurveyConfigs';
import SubmissionUploaderFiles from './submissionUploaderFiles';
import SubmissionUploaderFixtures from './submissionUploader.fixtures';
import { createRowProcessor } from './rowProcessor';
import {
  createQueue,
  onRowCompleted,
  onRowFailed,
  ClientMatcher,
  SubmissionMapper,
  SubmissionUploader,
} from './submissionUploaderProcessor';


describe('submission uploader e2e tests', function () {
  beforeEach(() => {
    resetDatabase();
    SubmissionUploaderSurveyConfigs.insert({
      _id: 'survey1',
      definition: SubmissionUploaderFixtures.getSurvey1Definition(),
    });
    SubmissionUploaderFiles.insert({
      _id: 'file1',
      surveyId: 'survey1',
      totalRows: 1,
      processedRows: 0,
      failedRows: 0,
      uploadedAt: new Date(),
      uploadedBy: 'user1',
    });
    Jobs.insert({
      _id: 'row1',
      queueId: 'queue1',
      status: JobStatus.PENDING,
      data: SubmissionUploaderFixtures.getSurvey1Row(),
    });
  });

  it('will successfully process a single job', function (done) {
    const surveyId = 'survey1';
    const surveyConfig = SubmissionUploaderSurveyConfigs.findOne(surveyId);
    const surveyApi = null;

    const clientMatcher = new ClientMatcher({ surveyConfig });
    const submissionMapper = new SubmissionMapper({ surveyConfig });
    const submissionUploader = new SubmissionUploader({ surveyApi });

    const jobProcessor = createRowProcessor({
      surveyId,
      clientMatcher,
      submissionMapper,
      submissionUploader,
    });
    const onJobCompleted = onRowCompleted({
      jobsStore: Jobs,
    });
    const onJobFailed = onRowFailed({
      jobsStore: Jobs,
    });

    const queue = createQueue({ jobProcessor, onJobCompleted, onJobFailed });

    queue.on('drain', () => {
      Promise.resolve().then(() => {
        const job = Jobs.findOne('row1');
        expect(job.status).to.equal(JobStatus.SUCCESS);
        expect(job.result).to.deep.equal({ submissionId: 'submission1' });

        done();
      }).catch(err => done(err));
    });

    // load queue with db entries
    Jobs.find().fetch().map(row => queue.push(row));
  });


  it('will fail a a single job when exception occurs during processing', function (done) {
    const jobProcessor = Meteor.bindEnvironment(
      (row, cb) => cb(new Error('Intentional error'))
    );
    const onJobCompleted = onRowCompleted({
      jobsStore: Jobs,
    });
    const onJobFailed = onRowFailed({
      jobsStore: Jobs,
    });

    const queue = createQueue({ jobProcessor, onJobCompleted, onJobFailed });

    queue.on('drain', () => {
      Promise.resolve().then(() => {
        const job = Jobs.findOne('row1');
        expect(job.status).to.equal(JobStatus.FAILED);
        expect(job.errorMessage).to.equal('Intentional error');
        done();
      }).catch(err => done(err));
    });

    // load queue with db entries
    Jobs.find().fetch().map(row => queue.push(row));
  });
});
