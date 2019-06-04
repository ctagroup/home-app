import React from 'react';
import { ResponseStatus } from '/imports/api/responses/responses';
import { formatDateTime } from '/imports/both/helpers';
import { useStateReducerActions } from '/imports/ui/components/generic/StateProvider';


const EnrollmentInfo = ({ response }) => {
  const isEnrollment = response.surveyType === 'enrollment';
  const isUploaded = !!response.enrollment;

  if (!isEnrollment || isUploaded) return null;

  return <span className="text-warning">Enrollment not uploaded</span>;
};


export const ResponseStatusCell = ({ response }) => {
  const [state] = useStateReducerActions();

  const { _id, submittedAt } = response;
  const status = (state.responses[_id] && state.responses[_id].status) || response.status;
  const errorMessage = (state.responses[_id] && state.responses[_id].message);
  const isUploaded = !!response.submissionId;
  const isClientUploaded = !!response.clientSchema;

  let responseInfo;

  switch (status) {
    case ResponseStatus.PAUSED:
      responseInfo = <span className="text-muted"><i className="fa fa-pause"></i> Paused</span>;
      break;

    case ResponseStatus.COMPLETED:
      if (isUploaded) {
        responseInfo = (<div className="text-success">
          <i className="fa fa-check"></i> Submitted on {formatDateTime(submittedAt)}
        </div>);
      } else if (isClientUploaded) {
        responseInfo = (<div className="text-warning">
          <i className="fa fa-check"></i> Response not uploaded}
        </div>);
      } else {
        responseInfo = <span className="text-warning">Client not uploaded</span>;
      }
      break;

    case ResponseStatus.UPLOADING:
      responseInfo = <p className="btn"><i className="fa fa-spinner fa-pulse" />  Uploading...</p>;
      break;

    case ResponseStatus.UPLOAD_ERROR:
      responseInfo = (<div className="text-danger">
        <i className="fa fa-exclamation-circle" /> Upload Error
      </div>);
      break;
    case ResponseStatus.NOT_IMPORTED:
      responseInfo = (<div className="text-warning">
        <i className="fa fa-exclamation-circle" /> Response not imported
      </div>);
      break;

    default:
      responseInfo = <span>{status}</span>;
  }

  return (<div>
    <div>{responseInfo}</div>
    <EnrollmentInfo response={response} />
    {errorMessage && <span className="text-danger">{errorMessage}</span>}
  </div>);
};
