/* eslint prefer-arrow-callback: "off", func-names: "off", no-unused-expressions: "off" */
import sinon from 'sinon';
import { expect } from 'chai';
import { JobStatus } from '/imports/api/jobs/jobs';
import SubmissionUploaderFixtures from './submissionUploader.fixtures';
import { createRowProcessor } from './rowProcessor';
import {
  // createQueue,
  // onRowCompleted,
  // onRowFailed,
  ClientMatcher,
  ResponseMapper,
  // SubmissionUploader,
} from './submissionUploaderProcessor';


describe('xxxx submission uploader - row processor', function () {
  it('ResponseMapper will map row to responses array', () => {
    const surveyConfig = SubmissionUploaderFixtures.getSurvey1Definition();
    const row = SubmissionUploaderFixtures.getSurvey1Row();
    const submissionMapper = new ResponseMapper({ surveyConfig });
    const result = submissionMapper.mapRowToResponse(row);

    expect(result).to.deep.equal([
      {
        questionId: 'question1',
        responseText: '1 Child',
      },
      {
        questionId: 'question3',
        responseText: 'No',
      },
      {
        questionId: 'question5',
        responseText: 'Friends',
      },
    ]);
  });

  it('ClientMatcher will match a client by source system id', () => {
    const surveyConfig = SubmissionUploaderFixtures.getSurvey1Definition();
    const row = SubmissionUploaderFixtures.getSurvey1Row();

    const fakeHmisClientApi = {
      searchClient: sinon.stub(),
    };
    fakeHmisClientApi.searchClient.withArgs(281052).returns([{
      clientId: 'client1',
      firstName: 'Foo',
      middleName: 'Bar',
      lastName: 'Baz',
      sourceSystemId: 281052,
    }]);

    const clientMatcher = new ClientMatcher({
      surveyConfig,
      hmisClientApi: fakeHmisClientApi,
    });

    expect(clientMatcher.matchRowToClient(row)).to.equal('client1');
  });

  it('ClientMatcher will throw an exception if no clients are found', () => {
    const surveyConfig = SubmissionUploaderFixtures.getSurvey1Definition();
    const row = SubmissionUploaderFixtures.getSurvey1Row();

    const fakeHmisClientApi = {
      searchClient: sinon.stub(),
    };
    fakeHmisClientApi.searchClient.withArgs(281052).returns([]);

    const clientMatcher = new ClientMatcher({
      surveyConfig,
      hmisClientApi: fakeHmisClientApi,
    });

    expect(() => clientMatcher.matchRowToClient(row))
      .to.throw('Cannot match client using query 281052. Found 0 clients.');
  });

  it('will process and upload a single row', (done) => {
    const surveyId = 'survey1';
    const surveyConfig = SubmissionUploaderFixtures.getSurvey1Definition();

    const fakeMatcher = {
      matchRowToClient: sinon.fake.returns('client1'),
    };
    const submissionMapper = new ResponseMapper({ surveyConfig });
    const fakeSubmissionUploader = {
      uploadSubmission: sinon.fake.returns('submission1'),
    };

    const processor = createRowProcessor({
      surveyId,
      clientMatcher: fakeMatcher,
      submissionMapper,
      submissionUploader: fakeSubmissionUploader,
    });

    const job = {
      _id: 'row1',
      queueId: 'queue1',
      status: JobStatus.PENDING,
      data: SubmissionUploaderFixtures.getSurvey1Row(),
    };
    processor(job, (err, result) => {
      try {
        expect(err).not.exist;
        // TODO: it would be better to check fake api server for a correct response
        expect(fakeSubmissionUploader.uploadSubmission.getCall(0).args[0]).to.equal('survey1');
        expect(fakeSubmissionUploader.uploadSubmission.getCall(0).args[1]).to.equal('client1');
        expect(result).to.deep.equal({
          submissionId: 'submission1',
          clientId: 'client1',
        });
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});

