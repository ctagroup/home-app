// import React, { useState } from 'react';
import React from 'react';
import ReferralSteps from '/imports/ui/components/referrals/Steps';
import PastReferralsList from '/imports/ui/components/referrals/PastReferralsList';

function ClientReferrals(props) {
  console.log('ClientReferrals', props);
  return (
    <div className="col-xs-12">
      <h3>Referral Status</h3>
      <ReferralSteps />
      <h3>Past Referrals</h3>
      <PastReferralsList />
    </div>
  );
}

export default ClientReferrals;
