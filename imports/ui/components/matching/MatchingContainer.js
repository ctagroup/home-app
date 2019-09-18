import React from 'react';
import MatchingLayout from './MatchingLayout';

const MatchingContainer = (props) => (
  <React.Fragment>
    <h3>New Referral</h3>
    <div className="form-group" style={{ minWidth: '12em', padding: '0 .25em' }}>
      <MatchingLayout {...props} permissions={props.permissions || {}} />
    </div>
  </React.Fragment>
);

export default MatchingContainer;
