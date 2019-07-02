import React from 'react';
import { formatDateFunction } from '/imports/ui/templateHelpers';
import { formatSSN } from './helpers';
import { getRace, getGender, getEthnicity, getYesNo } from '/imports/ui/clients/textHelpers';


function ClientOverview({ client, permissions }) {
  const {
    suffix,
    ssn,
    dob,
    race,
    ethnicity,
    gender,
    veteranStatus,
  } = client;

  const { showEditButton } = permissions;

  return (
    <div className="info-container">
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-md-6">
          <div className="">
            <p className="clabel">Suffix</p>
            <p className="cvalue">{suffix || ''}</p>
          </div>
          <div className="">
            <p className="clabel">SSN</p>
            <p className="cvalue">{formatSSN(ssn)}</p>
          </div>
          <div className="">
            <p className="clabel">Date of Birth</p>
            <p className="cvalue dob">{formatDateFunction(dob)}</p>
          </div>
          <div className="">
            <p className="clabel">Race</p>
            <p className="cvalue">{getRace(race)}</p>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-6">
          <div className="">
            <p className="clabel">Ethnicity</p>
            <p className="cvalue">{getEthnicity(ethnicity)}</p>
          </div>
          <div className="">
            <p className="clabel">Gender</p>
            <p className="cvalue">{getGender(gender)}</p>
          </div>
          <div className="">
            <p className="clabel">Veteran Status</p>
            <p className="cvalue">{getYesNo(veteranStatus)}</p>
          </div>
          {/*
          <div className="">
            <p className="clabel">Disabling Condition</p>
            <p className="cvalue">{getText('disablingcondition' disablingConditions)}</p>
          </div>
          */}
        </div>
      </div>
      {showEditButton &&
        <input className="btn btn-warning edit" value="Edit client" type="button" />}
    </div>
  );
}

export default ClientOverview;
