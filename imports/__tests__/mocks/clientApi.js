import sinon from 'sinon';

export default function createFakeClientApi() {
  return {
    searchClient: sinon.stub(),
  };
}

