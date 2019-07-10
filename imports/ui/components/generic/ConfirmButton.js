import React, { useState } from 'react';


const ConfirmButton = ({ label, confirmMessage, onConfirm, onCancel, ...props }) => {
  const [inProgress, setInProgress] = useState(false);

  function done() {
    setInProgress(false);
  }

  return (
    <button
      className="btn btn-danger"
      disabled={inProgress}
      onClick={() => {
        setInProgress(true);
        // TODO: replace with dedicated dialog in the future (when migration to React is completed)
        if (window.confirm(confirmMessage || 'Are you sure?')) { // eslint-disable-line no-alert
          if (onConfirm) {
            onConfirm(props, done);
          }
        } else {
          if (onCancel) {
            onCancel(props, done);
          } else {
            setInProgress(false);
          }
        }
      }}
    >
      {label}
    </button>
  );
};

export default ConfirmButton;
