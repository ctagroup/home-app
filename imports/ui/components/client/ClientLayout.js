import React, { useState } from 'react';
import ClientTabSelector from './ClientTabSelector';
import ClientGeneralInfo from './ClientGeneralInfo';
import ClientOverview from './ClientOverview';
import ClientTab from './ClientTab';
import ClientEnrollments from './ClientEnrollments';
import ClientEligibility from './ClientEligibility';
import ClientMatchNotes from './ClientMatchNotes';

function ClientLayout(props) {
  const { client, permissions, eligibleClient, data, helpers } = props;
  const {
    showReferralStatus,
    showEnrollments,
    updateEnrollment,
    annualEnrollment,
    exitEnrollment,
    isSkidrowApp,
    showEditButton,
  } = permissions;

  const tabsList = [
    { id: 'overview', enabled: true, title: 'Overview' },
    { id: 'eligibility', enabled: true, title: 'History' },
    { id: 'rois', enabled: !isSkidrowApp, title: 'ROIs' },
    { id: 'referrals', enabled: showReferralStatus, title: 'Referrals' },
    { id: 'enrollments', enabled: showEnrollments, title: 'Enrollments' },
    { id: 'create-enrollment', enabled: showEnrollments, title: 'Create Enrollment' },
    { id: 'update-enrollment', enabled:
      showEnrollments && updateEnrollment, title: 'Update Enrollment' },
    { id: 'annual-enrollment', enabled:
      showEnrollments && annualEnrollment, title: 'Annual Enrollment' },
    { id: 'exit-enrollment', enabled:
      showEnrollments && exitEnrollment, title: 'Exit Enrollment' },
    { id: 'client-tags', enabled: !isSkidrowApp, title: 'Tags' },
    { id: 'services', enabled: !isSkidrowApp, title: 'Services' },
    // { id: 'case-management', enabled: false, title: 'Case Management' },
    // { id: 'responses', enabled: false, title: 'Responses' },
  ].filter((t) => t.enabled);

  const [selectedTab, selectTab] = useState(props.selectedTab || tabsList[0].id);

  // console.log('selectedTab', selectedTab);

  return (
    <div id="viewClient_content" className="col-xs-12">
      <ClientMatchNotes matchId="1" step="1" />

      {eligibleClient && eligibleClient.ignoreMatchProcess &&
        <div className="col-xs-12">
          <div className="alert alert-danger">
            Client has been Removed from Matching
          </div>
        </div>
      }
      <div className="row client-profile-container">
        <ClientGeneralInfo client={client} helpers={helpers.generalInfo} />

        <div className="tab-section">
          <ClientTabSelector tabs={tabsList} tab={selectedTab} selectTab={selectTab} />

          <div className="tab-content card">
            <ClientTab selectedTab={selectedTab} id={'overview'} >
              <ClientOverview
                client={client} permissions={{ showEditButton }} helpers={helpers.overview}
              />
            </ClientTab>
            <ClientTab selectedTab={selectedTab} id={'eligibility'} >
              <ClientEligibility
                eligibleClient={data.eligibleClient()}
                client={client} permissions={{ showEditButton }} helpers={helpers.eligibility}
              />
            </ClientTab>
            <ClientTab selectedTab={selectedTab} id={'enrollments'} >
              <ClientEnrollments
                client={client} permissions={{ showEditButton }}
                enrollments={data.enrollments()}
                helpers={helpers.enrollments}
              />
            </ClientTab>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientLayout;
