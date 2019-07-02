import React, { useState } from 'react';
import { useTracker } from 'react-meteor-hooks';
import ClientTabSelector from './ClientTabSelector';
import ClientGeneralInfo from './ClientGeneralInfo';
import ClientOverview from './ClientOverview';
import ClientTab from './ClientTab';
import ClientEnrollments from './ClientEnrollments';
import ClientEligibility from './ClientEligibility';

function ClientLayout(props) {
  const { client, eligibleClient, permissions } = props;
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
    {
      id: 'overview',
      enabled: true,
      title: 'Overview',
      component: (
        <ClientOverview
          client={client}
          permissions={{ showEditButton }}
        />
      ),
    },
    {
      id: 'eligibility',
      enabled: true,
      title: 'History',
      component: (
        <ClientEligibility
          eligibleClient={eligibleClient}
          client={client}
          permissions={{ showEditButton }}
        />
      ),
    },
    /*
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
    */
  ].filter((t) => t.enabled);

  const [selectedTab, selectTab] = useState(tabsList[0].id);

  // useTracker(() => {
  //   const query = Router.current().params.query || {};
  //   if (selectedTab !== query.selectedTab) {
  //     selectTab(query.selectedTab);
  //   }
  // }, []);

  const showRemovedFromMatchingWarning = eligibleClient && eligibleClient.ignoreMatchProcess;

  const activeTab = tabsList.find(tab => tab.id === selectedTab) || tabsList[0];

  return (
    <div id="viewClient_content" className="col-xs-12">
      {showRemovedFromMatchingWarning &&
        <div className="row">
          <div className="col-xs-12">
            <div className="alert alert-danger">
              Client has been Removed from Matching
            </div>
          </div>
        </div>
      }

      <div className="row client-profile-container">
        <ClientGeneralInfo client={client} />
      </div>

      <div className="row">
        <div className="tab-section">
          <ClientTabSelector tabs={tabsList} selectedTab={selectedTab} selectTab={selectTab} />

          <div className="tab-content card">
            {activeTab.component}

            {/*
            <ClientTab selectedTab={selectedTab} id={'overview'} >
              <ClientOverview
                client={client}
                permissions={{ showEditButton }}
              />
            </ClientTab>
                {/*
            <ClientTab selectedTab={selectedTab} id={'eligibility'} >
            </ClientTab>
            <ClientTab selectedTab={selectedTab} id={'enrollments'} >
              <ClientEnrollments
                activeProjectId={Meteor.user().activeProjectId}
                client={client}
                permissions={{ showEditButton }}
                enrollments={data.enrollments()}
                helpers={helpers.enrollments}
              />
            </ClientTab>
          */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientLayout;
