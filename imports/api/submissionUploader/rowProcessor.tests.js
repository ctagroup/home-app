/* eslint prefer-arrow-callback: "off", func-names: "off", no-unused-expressions: "off" */
import sinon from 'sinon';
import { expect } from 'chai';
import { JobStatus } from '/imports/api/jobs/jobs';
import SubmissionUploaderFixtures from '/imports/__tests__/fixtures/submissionUploader';
import createFakeClientApi from '/imports/__tests__/mocks/clientApi';
import createFakeSurveyApi from '/imports/__tests__/mocks/surveyApi';
import {
  ClientMatcher,
  ResponseMapper,
  SubmissionUploader,
  createRowProcessor,
} from './rowProcessor';


describe('submission uploader - row processor', function () {
  it('ClientMatcher will match a client by source system id', () => {
    const surveyConfig = SubmissionUploaderFixtures.getSurvey1Definition();
    const row = SubmissionUploaderFixtures.getSurvey1Row();

    const fakeHmisClientApi = createFakeClientApi();
    fakeHmisClientApi.searchClient.withArgs(281052).returns([{
      clientId: 'client1',
      firstName: 'Foo',
      middleName: 'Bar',
      lastName: 'Baz',
      sourceSystemId: 281052,
    }]);

    const clientMatcher = new ClientMatcher({
      surveyConfig,
      clientApi: fakeHmisClientApi,
    });

    expect(clientMatcher.matchRowToClient(row)).to.equal('client1');
  });

  it('ClientMatcher will throw an exception if no clients are found', () => {
    const surveyConfig = SubmissionUploaderFixtures.getSurvey1Definition();
    const row = SubmissionUploaderFixtures.getSurvey1Row();

    const fakeHmisClientApi = createFakeClientApi();
    fakeHmisClientApi.searchClient.withArgs(281052).returns([]);

    const clientMatcher = new ClientMatcher({
      surveyConfig,
      clientApi: fakeHmisClientApi,
    });

    expect(() => clientMatcher.matchRowToClient(row))
      .to.throw('Cannot match client using query 281052. Found 0 clients.');
  });

  // TODO: ClientMatcher will throw an exception if no sourceSystemId in definition

  it('ResponseMapper will map row to responses array', () => {
    const surveyConfig = SubmissionUploaderFixtures.getSurvey1Definition();
    const row = SubmissionUploaderFixtures.getSurvey1Row();
    const submissionMapper = new ResponseMapper({ surveyConfig });
    const result = submissionMapper.mapRowToResponse(row);

    expect(result).to.deep.equal([
      {
        questionId: 'question1',
        responseText: '1 Child',
        sectionId: 'section1',
      },
      {
        questionId: 'question3',
        responseText: 'No',
        sectionId: 'section2',
      },
      {
        questionId: 'question5',
        responseText: 'Friends',
        sectionId: 'section3',
      },
    ]);
  });

  it('SubmissionUploader will successfully upload a row', () => {
    const surveyId = 'survey1';
    const clientId = 'client1';
    const responses = [
      {
        questionId: 'question1',
        responseText: 'foo',
      },
      {
        questionId: 'question2',
        responseText: 'bar',
      },
    ];


    const fakeSurveyApi = createFakeSurveyApi();
    fakeSurveyApi.createSubmission.returns({
      submissionId: 'submission1',
    });

    const submissionUploader = new SubmissionUploader({
      surveyApi: fakeSurveyApi,
    });
    const submissionId = submissionUploader.uploadSubmission(surveyId, clientId, responses);
    expect(submissionId).to.equal('submission1');
    expect(fakeSurveyApi.createSubmission.getCall(0).args).to.deep.equal([
      'client1',
      'survey1',
      responses,
    ]);
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
      jobsStore: {
        setJobStatus: sinon.stub(),
      },
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

