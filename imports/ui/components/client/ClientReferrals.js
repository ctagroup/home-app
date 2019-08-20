import React, { useEffect, useState } from 'react';
import ReferralSteps from '/imports/ui/components/referrals/Steps';
import PastReferralsList from '/imports/ui/components/referrals/PastReferralsList';


function isMatchCompleted(match) {
  // for now lets assume that completed match has end date set
  return !!match.endDate;
}

function ClientReferrals({ client }) {
  const [clientMatches, setClientMatches] = useState([]);
  const [lastDataFetch, setLastDataFetch] = useState(null);

  const { dedupClientId } = client;

  const ongoingReferral = clientMatches.find(m => !isMatchCompleted(m));
  const pastReferrals = clientMatches.filter(isMatchCompleted);

  function updateClientMatches() {
    setLastDataFetch(new Date());
  }

  useEffect(() => {
    Meteor.call('matchApi', 'getClientMatches', dedupClientId, (err, res) => {
      if (err) {
        setClientMatches([]);
        console.error('Failed to load client matches', err);
      } else {
        setClientMatches(res);
        console.log('new data', res);
      }
    });
  }, [lastDataFetch]);

  function renderSelectedReferral() {
    if (!ongoingReferral) {
      return (
        <p>
          No ongoing referrals.
          Switch to <strong>New Referral</strong> tab to create a new referral.
        </p>
      );
    }

    console.log('history', ongoingReferral.history);

    const lastStepId = ongoingReferral.history.length ?
      ongoingReferral.history[ongoingReferral.history.length - 1].step
      : null;

    return (
      <div>
        <h3>Referral Status</h3>
        <ReferralSteps
          matchId={ongoingReferral.id}
          lastStepId={lastStepId}
          handleDataReload={updateClientMatches}
        />
      </div>
    );
  }


  return (
    <div className="col-xs-12">
      {renderSelectedReferral()}
      <h3>Past Referrals</h3>
      <PastReferralsList referrals={pastReferrals} />
    </div>
  );
}

export default ClientReferrals;
