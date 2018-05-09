import sinon from 'sinon';

export default function createFakeSurveyApi() {
  return {
    createSubmission: sinon.stub(),
  };
}

