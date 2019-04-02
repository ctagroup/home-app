import React from 'react';
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

