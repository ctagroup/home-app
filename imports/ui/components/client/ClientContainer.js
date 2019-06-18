import React from 'react';
// import React, { Component, useState } from 'react';
// import DataTable from '/imports/ui/components/dataTable/DataTable';
// import { removeClientTagButton } from '/imports/ui/dataTable/helpers.js';
import ClientLayout from './ClientLayout';


const ClientContainer = (props) => {
  const permissions = {

  };


  return (
    <div>
      <ClientLayout
        activeProjectId
        client
        eligibleClient
        selectedTab
        permissions={permissions}
      />
    </div>
  );
};

export default ClientContainer;
