import React, { useState } from 'react';
import { fullName } from '/imports/api/utils';
import SubmissionsTable from '/imports/ui/submissions/components/SubmissionsTable';
import ClientSearch from '/imports/ui/components/client/ClientSearch';

const SubmissionsList = () => {
  const [selectedClient, setSelectedClient] = useState(null);

  function onClientSelect(client) {
    setSelectedClient(client);
  }

  function renderSelectedClient() {
    return (
      <p>
        <strong>Client: </strong>{fullName(selectedClient)} ({selectedClient.schema})
      </p>
    );
  }

  const dedupClientId = selectedClient ? selectedClient.dedupClientId : null;

  return (
    <div>
      <ClientSearch onClientSelect={onClientSelect} />
      <div>{selectedClient && renderSelectedClient()}</div>
      <SubmissionsTable dedupClientId={dedupClientId} />
    </div>
  );
};

export default SubmissionsList;
