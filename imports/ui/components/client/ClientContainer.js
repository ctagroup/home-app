import React, { useEffect } from 'react';
import ClientLayout from './ClientLayout';
import { useGlobalStore } from '/imports/ui/components/store';

const ClientContainer = (props) => {
  const permissions = {
    showReferralStatus: true,
    showEnrollments: true,
    updateEnrollment: true,
    annualEnrollment: true,
    exitEnrollment: true,
    isSkidrowApp: true,
    showEditButton: true,
  };

  const [store, actions] = useGlobalStore();

  useEffect(() => {
    // handle data coming from Meteor publication

    console.log(props);

    // const { client, eligibleClient } = props;
    // actions.setClient(client);
    // actions.setEligibleClient({
    //   ...eligibleClient,
    //   dedupClientId: client.dedupClientId,
    // });
  }, []);

  return (
    <div>
      <ClientLayout
        activeProjectId={props.activeProjectId}
        client={store.client}
        eligibleClient={store.eligibleClient}
        permissions={permissions}
      />
    </div>
  );
};

export default ClientContainer;
