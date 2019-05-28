import React from 'react';
import Alert from '/imports/ui/alert';
import { ResponseStatus } from '/imports/api/responses/responses';
import { formatDateTime } from '/imports/both/helpers';


const EnrollmentExtraInfo = ({ response }) => {
  const { uploading } = response;

  if (response.surveyType !== 'enrollment') return null;

  if (!response.enrollment) {
    if (uploading) return 'Uploading...';
    // FIXME: when responses is uploaded, response.status
    // will change. That means we need to have a reducer for
    // handling data changes (useReducer) and a page context
    // to access reducer's dispatch function from child
    // components such as EnrollmentExtraInfo
    return 'Enrollment not uploaded';
  }
  return 'Enrollment uploaded';
};


export const ResponseStatusCell = ({ response }) => {
  const { _id, status, submittedAt, uploadResult } = response;
  // const [responseStatus, setResponseStatus] = useState(status);
  // const [uploadResult, setUploadResult] = useState(false);

  function uploadResponse() {
    // setResponseStatus(ResponseStatus.UPLOADING);
    Meteor.call('responses.uploadToHmis', _id, (err, invalidResponses) => {
      if (err) {
        Alert.error(err);
        // setResponseStatus(ResponseStatus.UPLOAD_ERROR);
        // setUploadResult(<p className="text-danger">{`${err.message}`}</p>);
      } else {
        // setResponseStatus(ResponseStatus.COMPLETED);
        if (invalidResponses.length > 0) {
          const list = invalidResponses.map(r => r.id).join(', ');
          Alert.warning(`Success but ${invalidResponses.length} answers not uploaded: ${list}`);
          // setUploadResult(
          //   <p className="text-warning">{`${invalidResponses.length} answers not uploaded`}</p>
          // );
        } else {
          Alert.success('Response uploaded');
          // setUploadResult(<p className="text-success">ok</p>);
        }
      }
    });
  }

  const uploadResponseButton = (
    <a href="#" className="btn" onClick={uploadResponse}>
      (Re-Upload to HMIS)
    </a>);

  switch (status) {
    case ResponseStatus.PAUSED:
      return <span className="text-muted"><i className="fa fa-pause"></i> Paused</span>;

    case ResponseStatus.COMPLETED:
      if (response.submissionId) {
        return (<div>
          <span className="text-success">
            <i className="fa fa-check"></i> Submitted on {formatDateTime(submittedAt)}
          </span>
          <br />
          {uploadResponseButton}
          {uploadResult}
          <EnrollmentExtraInfo response={response} />
        </div>);
      }
      if (response.clientSchema) {
        return (<a
          href="#"
          className="btn UploadResponses"
        >Upload to HMIS</a>);
      }
      return <span className="text-warning">Upload client first</span>;

    case ResponseStatus.UPLOADING:
      return <p className="btn"><i className="fa fa-spinner fa-pulse" />  Uploading...</p>;

    case ResponseStatus.UPLOAD_ERROR:
      return (<div>
        <span className="text-danger">
          <i className="fa fa-exclamation-circle" /> Upload Error
        </span>
        <br />
        {uploadResponseButton}
        {uploadResult}
      </div>);
    default:
      return <span>{status}</span>;
  }
};
