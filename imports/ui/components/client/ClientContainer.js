import React, { useEffect, useState } from 'react';
import ApplicationError from '/imports/ui/components/client/ApplicationError';
import { Provider, useSelector, useDispatch } from 'react-redux';

import store from '/imports/ui/models/store';
// import React, { Component, useState } from 'react';
// import DataTable from '/imports/ui/components/dataTable/DataTable';
// import { removeClientTagButton } from '/imports/ui/dataTable/helpers.js';
import ClientLayout from './ClientLayout';


const ClientLoader = ({ dedupClientId }) => {
  const clientPage = useSelector(state => state.clientPage);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadClientData() {
      dispatch.clientPage.loadClient(dedupClientId).catch(err => setError(err));
      dispatch.clientPage.loadClientPhoto(dedupClientId);
    }
    loadClientData();
  }, [dedupClientId]);

  if (error) {
    return <ApplicationError error={error} />;
  }

  const permissions = {};
  const { client, eligibleClient } = clientPage;

  return (
    <ClientLayout
      client={client}
      eligibleClient={eligibleClient}
      permissions={permissions}
    />
  );
};

const ClientContainer = props => (
  <Provider store={store}>
    <ClientLoader {...props} />
  </Provider>
);

export default ClientContainer;
