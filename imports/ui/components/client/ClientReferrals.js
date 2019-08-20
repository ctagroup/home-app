import React, { useState, useEffect } from 'react';
import ReferralSteps from '/imports/ui/components/referrals/Steps';
import PastReferralsList from '/imports/ui/components/referrals/PastReferralsList';
import MatchingContainer from '/imports/ui/components/matching/MatchingContainer';

function ClientReferrals(props) {
  console.log('ClientReferrals', props);
  const { client: { dedupClientId }, helpers } = props;
  const [lastDataFetch, setLastDataFetch] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const projects = helpers.getProjects();
  console.log('projects');

  useEffect(() => {
    Meteor.call('matchApi', 'getClientMatches', dedupClientId, (err, res) => {
      if (err) {
        console.log('Error at getClientMatches', err);
      //   setNotes([{
      //     id: '0',
      //     text: `An error has occurred ${err}`,
      //   }]);
      } else {
        setMatches(res.matches);
        // setNotes(res.notes);
      }
    });
  }, [lastDataFetch]);

  const getActiveReferral = (referrals) => {
    const now = new Date();
    return referrals
      .find((referral) =>
        now >= referral.startDate && now <= referral.endDate && !referral.outcome);
  };
  const activeReferral = getActiveReferral(matches || []);
  const isActive = !!activeReferral;
  const renderActiveReferral = () => (
    <div>
      <span>
        Referred on: {activeReferral.startDate}
      </span>
      <span>
        Referred to: {activeReferral.projectId}
      </span>
      <span>
        Referred by: {activeReferral.userId}
      </span>
    </div>
  );
  return (
    <div className="col-xs-12">
      {isActive && <div>
        <h3>Current Referral</h3>
        {renderActiveReferral()}
        <h3>Referral Status</h3>
        <ReferralSteps />
      </div>}
      {!isActive && <MatchingContainer />}
      <h3>Past Referrals</h3>
      <PastReferralsList />
    </div>
  );
}

export default ClientReferrals;
