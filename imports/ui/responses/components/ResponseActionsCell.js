import React from 'react';
import Alert from '/imports/ui/alert';
import { ResponseStatus } from '/imports/api/responses/responses';
import { useStateReducerActions } from '/imports/ui/components/generic/StateProvider';

export const ResponseActionsCell = ({ response }) => {
  const { _id, surveyType } = response;
  const [state, dispatch] = useStateReducerActions();

  const status = (state.responses[_id] && state.responses[_id].status) || response.status;

  const isPaused = status === ResponseStatus.PAUSED;
  const isImported = status !== ResponseStatus.NOT_IMPORTED;
  const isActionInProgress = status === ResponseStatus.UPLOADING;
  const isEnrollmentResponse = (surveyType === 'enrollment');

  function uploadResponse() {
    dispatch({ type: 'RESPONSE_UPLOADING', responseId: _id });
    Meteor.call('responses.uploadToHmis', _id, (err, invalidResponses) => {
      if (err) {
        Alert.error(err);
        dispatch({ type: 'RESPONSE_UPLOAD_ERROR', responseId: _id, message: err.message });
      } else {
        dispatch({ type: 'RESPONSE_UPLOAD_SUCCESS', responseId: _id });
        if (invalidResponses.length > 0) {
          const list = invalidResponses.map(r => r.id).join(', ');
          Alert.warning(`Success but ${invalidResponses.length} answers not uploaded: ${list}`);
        } else {
          Alert.success('Response uploaded');
        }
      }
    });
  }

  function uploadEnrollment() {
    dispatch({ type: 'RESPONSE_UPLOADING', responseId: _id });
    Meteor.call('responses.uploadEnrollment', _id, (err) => {
      if (err) {
        Alert.error(err);
        dispatch({ type: 'RESPONSE_UPLOAD_ERROR', responseId: _id, message: err.message });
      } else {
        dispatch({ type: 'RESPONSE_UPLOAD_SUCCESS', responseId: _id });
        Alert.success('Enrollment uploaded');
      }
    });
  }

  function deleteResoponse() {
    Alert.warning('Not yet implemented');
  }

  const buttons = [];

  if (!isImported) {
    /*
    buttons.push(<button
      key="importResponse"
      className="btn btn-default"
      onClick={importResponse}
      title="Import response"
      disabled={isActionInProgress}
    >
      <i className="fa fa-cloud-download" /> Import
    </button>);
    */
  } else {
    if (!isPaused) {
      buttons.push(
        <button
          key="uploadResponse"
          className="btn btn-default"
          onClick={uploadResponse}
          title="Upload response"
          disabled={isActionInProgress}
        >
          <i className="fa fa-cloud-upload" /> R
        </button>
      );
    }

    if (isEnrollmentResponse && !isPaused) {
      buttons.push(
        <button
          key="uploadEnrollment"
          className="btn btn-default"
          onClick={uploadEnrollment}
          title="Upload enrollment"
          disabled={isActionInProgress}
        >
          <i className="fa fa-cloud-upload" /> E
        </button>
      );
    }

    buttons.push(
      <button
        key="deleteResponse"
        className="btn btn-danger pull-right"
        onClick={deleteResoponse}
        title="Delete response"
        disabled={isActionInProgress}
      >
        <i className="fa fa-trash" />
      </button>
    );
  }

  return (
    <div className="actionButtons">
      {buttons}
    </div>
  );
};
