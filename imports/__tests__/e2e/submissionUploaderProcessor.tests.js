/* eslint prefer-arrow-callback: "off", func-names: "off", no-unused-expressions: "off" */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import Jobs, { JobStatus } from '/imports/api/jobs/jobs';
import SubmissionUploaderSurveyConfigs from
  '/imports/api/submissionUploader/submissionUploaderSurveyConfigs';
import SubmissionUploaderFiles from '/imports/api/submissionUploader/submissionUploaderFiles';
import SubmissionUploaderFixtures from '/imports/__tests__/fixtures/submissionUploader';
import createFakeClientApi from '/imports/__tests__/mocks/clientApi';
import createFakeSurveyApi from '/imports/__tests__/mocks/surveyApi';

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


describe('xxxx submission uploader e2e tests', function () {
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
      data: {
        row: SubmissionUploaderFixtures.getSurvey1Row(),
      },
    });
  });

  it('will successfully process a single job', function (done) {
    const surveyId = 'survey1';
    const surveyConfig = SubmissionUploaderSurveyConfigs.findOne(surveyId).definition;
    const clientApi = createFakeClientApi();
    clientApi.searchClient.returns(['client1']);
    const surveyApi = createFakeSurveyApi();
    surveyApi.createSubmission.returns({ submissionId: 'submission1' });

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
      Promise.resolve().then(() => {
        const job = Jobs.findOne('row1');
        expect(job.status).to.equal(JobStatus.SUCCESS);
        expect(job.result).to.deep.equal({ submissionId: 'submission1' });

        done();
      }).catch(err => done(err));
    });

    // load queue with db entries
    Jobs.find().fetch().map(job => queue.push({
      id: job._id,
      data: job.data.row,
    }));
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
        expect(job.error.message).to.equal('Intentional error');
        done();
      }).catch(err => done(err));
    });

    // load queue with db entries
    Jobs.find().fetch().map(job => queue.push({
      id: job._id,
      data: job.data.row,
    }));
  });
});
