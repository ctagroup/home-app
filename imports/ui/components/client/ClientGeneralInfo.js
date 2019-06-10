import React from 'react';
import { formatDateFunction } from '/imports/ui/templateHelpers';
import { formatSSN } from './helpers';
// import { Link } from '/imports/ui/components/generic/Link';


const ClientVersionsList = ({ client }) => {
  const { clientVersions, clientId } = client;
  return (
    <div>{clientVersions.map(v => {
      const className = v.clientId === clientId ? 'badge badge-primary' : 'badge';
      return (
        <span
          style={{ marginRight: 4 }}
          key={v.clientId}
          className={className}
          title={v.clientId}
        >
          {v.schema}
        </span>
      );
    })}</div>
  );
};

function ClientGeneralInfo(props) {
  const { client } = props;
  const {
    firstName,
    middleName,
    lastName,
    dob,
    ssn,
    _id,
    dedupClientId,
    photo,
    emailAddress,
    phoneNumber,
    clientTagNames, //FIXME: make helper function
  } = client;
  return (
    <div className="client-info">
      <div className="row">
        <div className="col-xs-12 col-sm-3">
          {photo && <img className="profile-img" alt="client profile" src={photo} />}
        </div>
        <div className="col-xs-12 col-sm-3"><div className="text-wrap">
          <span className="title">FIRST NAME</span><h2>{firstName}</h2>
          <span className="title">MIDDLE NAME</span><h2>{middleName}</h2>
          <span className="title">LAST NAME</span><h2>{lastName}</h2>
        </div></div>
        <div className="col-xs-12 col-sm-3"><div className="text-wrap">
          <span className="title">DOB</span><h4>{formatDateFunction(dob)}</h4>
          <span className="title">SSN</span><h4>{formatSSN(ssn)}</h4>
          <div className="title view-id">
            ClientId: {_id}<br />
            DedupId: {dedupClientId}
            {false && <ClientVersionsList client={client} />}
          </div>
        </div></div>
        <div className="col-xs-12 col-sm-3"><div className="text-wrap">
          <span className="title">EMAIL</span><h4>{emailAddress}</h4>
          <span className="title">PHONE NUMBER</span><h4>{phoneNumber}</h4>
          <span className="title">Active Tags</span><h4>{clientTagNames}</h4>
        </div></div>
      </div>
    </div>
  );
}

export default ClientGeneralInfo;
