import React from 'react';
import { StateProvider } from '/imports/ui/components/generic/StateProvider';
import { ResponseStatus } from '/imports/api/responses/responses';
import { Link } from '/imports/ui/components/generic/Link';
import ResponsesTable from './ResponsesTable';

const initialState = {
  responses: {},
  test: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'RESPONSE_UPLOADING':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.responseId]: {
            status: ResponseStatus.UPLOADING,
          },
        },
      };

    case 'RESPONSE_UPLOAD_ERROR':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.responseId]: {
            status: ResponseStatus.UPLOAD_ERROR,
            message: action.message,
          },
        },
      };

    case 'RESPONSE_UPLOAD_SUCCESS':
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.responseId]: {
            status: ResponseStatus.COMPLETED,
          },
        },
      };

    default:
      console.warn('unknown action', action); // eslint-disable-line
      return state;
  }
};

const actions = {
  // TODO: move all Meteor.call here
};

const ResponsesList = ({ data }) => (
  <StateProvider initialState={initialState} reducer={reducer} actions={actions}>
    {data.clientId &&
      <Link
        style={{ marginBottom: 20 }}
        route="adminDashboardresponsesNew"
        className="btn btn-primary"
        query={{ clientId: data.clientId, schema: data.client.schema }}
      >
        Survey client
      </Link>
    }
    <ResponsesTable enableSearch={!data.clientId || true} />
  </StateProvider>
);

export default ResponsesList;
