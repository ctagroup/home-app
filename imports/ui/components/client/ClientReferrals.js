import React, { useEffect, useState } from 'react';
import Projects from '/imports/api/projects/projects';
// import Users from '/imports/api/users/users';
import ReferralSteps from '/imports/ui/components/referrals/Steps';
import PastReferralsList from '/imports/ui/components/referrals/PastReferralsList';
import MatchingContainer from '/imports/ui/components/matching/MatchingContainer';

function isMatchCompleted(match) {
  // for now lets assume that completed match has end date set
  return !!match.endDate;
}

function ClientReferrals(props) {
  const { client: { dedupClientId } } = props;
  const [lastDataFetch, setLastDataFetch] = useState(new Date());
  const [clientMatches, setClientMatches] = useState([]);

  const ongoingReferral = clientMatches.find(m => !isMatchCompleted(m));
  const pastReferrals = clientMatches.filter(isMatchCompleted);
  const getLastStepId = (referral) => (referral && referral.history && referral.history.length ?
    referral.history[referral.history.length - 1].step
    : null);
  const lastStepId = getLastStepId(ongoingReferral);

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
        // console.log('new data', res);
      }
    });
  }, [lastDataFetch]);


  const isActive = !!ongoingReferral;
  const getProjectName = (projectId) => {
    const project = Projects.findOne(projectId);
    return project ? project.projectName : projectId;
  };
  // const getUserName = (userId) => {
  //   const user = Users.findOne(userId);
  //   if (!user) return userId;
  //   if (user.username) return user.username;
  //   return user.emails && user.emails.length && user.emails[0].address || userId;
  // };
  const renderActiveReferral = () => (
    <div>
      <span>
        Referred on:&nbsp;{ongoingReferral.startDate}
      </span>
      <br />
      <span>
        Referred to:&nbsp;{getProjectName(ongoingReferral.projectId)}
      </span>
      {/* <br />
      <span>
        Referred by:&nbsp;{getUserName(ongoingReferral.userId)}
      </span>
      */}
    </div>
  );

  function renderSelectedReferral() {
    if (!ongoingReferral) {
      return (
        <p>
          No ongoing referrals.
          Switch to <strong>New Referral</strong> tab to create a new referral.
        </p>
      );
    }

    return (
      <div>
        <h3>Current Referral</h3>
        {renderActiveReferral()}
        <h3>Curent Referral Status</h3>
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
      {isActive && renderSelectedReferral()}
      {!isActive && <MatchingContainer
        dedupClientId={dedupClientId}
        helpers={props.helpers}
        handleDataReload={updateClientMatches}
      />}
      <h3>Past Referrals</h3>
      <PastReferralsList referrals={pastReferrals} />
    </div>
  );
}

export default ClientReferrals;
