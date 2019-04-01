import moment from 'moment';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';

class ClientProfile extends React.Component {
  render() {
    //console.log(this.props.loading);
    //console.log(this.props.client);
    const { firstName, lastName, middleName, dob, ssn, clientId, dedupClientId, emailAddress, phoneNumber } = this.props.loading ? {} : this.props.client;
    return (
      <div className="client-info">
        <div className="row">
          <div className="col-xs-12 col-sm-3"></div>
          <div className="col-xs-12 col-sm-3">
            <div className="text-wrap">
              <span className="title">FIRST NAME</span><h2>{firstName}</h2>
              <span className="title">MIDDLE NAME</span><h2>{middleName}</h2>
              <span className="title">LAST NAME</span><h2>{lastName}</h2>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="text-wrap">
              <span className="title">DOB</span><h4>{moment.utc(dob).format('MM/DD/YYYY')}</h4>
              <span className="title">SSN</span><h4>{ssn}</h4>
              <div className="title view1-id">ClientId: {clientId} <br /> DedupId: {dedupClientId}
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3">
            <div className="text-wrap">
              <span className="title">EMAIL</span><h4>{emailAddress}</h4>
              <span className="title">PHONE NUMBER</span><h4>{phoneNumber}</h4>
              <span className="title">Active Tags</span><h4></h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default createContainer((props) => {
    const {clientId} = props.clientId;
    const handle = Meteor.subscribe('clients.one', clientId);
    
    return {
        loading: !handle.ready(),
        client: Clients.findOne({ _id: clientId })
    }
}, ClientProfile)
