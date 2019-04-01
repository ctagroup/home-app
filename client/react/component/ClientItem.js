import React from 'react';
// import { withTracker } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';
import ClientProfile from './ClientProfile.js';
import ClientTabs from './ClientTabs.js';
import ClientOverviewTab from './ClientOverviewTab.js';
import ClientHistory from './ClientHistory.js';
import ClientRoi from './ClientRoi.js';
import ClientReferrals from './ClientReferrals.js';
import ClientEnrollment from './ClientEnrollment.js';
import ClientTags from './ClientTags.js';
import ClientServices from './ClientServices.js';


export default class ClientItem extends React.Component {
	
  render() {
    const { clientId } = this.props.match.params;
    return (
      <div className="row client-profile-container">
        <ClientProfile clientId={{ clientId }} />
        <div className="tab-section custom">
          <ClientTabs clientId={{ clientId }} />
          <ClientOverviewTab clientId={{ clientId }} />
          <ClientHistory clientId={{ clientId }} />
          <ClientRoi clientId={{ clientId }} />
          <ClientReferrals clientId={{ clientId }} />
          <ClientEnrollment clientId={{ clientId }} />
          <ClientTags clientId={{ clientId }} />
          <ClientServices clientId={{ clientId }} />
        </div>
      </div>
    );
  }
}

// export default withTracker((props) => {
//     Meteor.subscribe('pendingClients.one', '69c1b307-c39d-4fb7-81a1-78ea198dd628');
//     return {
//         client: Clients.findOne({_id: '69c1b307-c39d-4fb7-81a1-78ea198dd628'}).fetch()
//     }
// })(ClientItem);
