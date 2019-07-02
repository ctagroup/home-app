import React from 'react';
import { useCurrentUser } from 'react-meteor-hooks';

const ApplicationError = ({ error }) => {
  const user = useCurrentUser();
  return (
    <div>
      <p><strong>An error has occurred!</strong></p>
      <p><strong>Error: </strong>{error.error}</p>
      <p><strong>Message: </strong>{error.message}</p>
      <p><strong>Details: </strong>{error.details || error.reason}</p>
      <p><strong>Time: </strong>{`${new Date()}`}</p>
      <p><strong>User Id: </strong>{user._id}</p>
      <p><strong>URL: </strong>{document.URL}</p>
    </div>
  );
};

export default ApplicationError;
