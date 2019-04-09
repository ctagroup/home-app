import moment from 'moment';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';
import { getText } from '../helpers/functionHelpers.js';

class ClientOverviewTab extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.edit = this.edit.bind(this);
  }

  edit() {
    const query = {};
    const client = this.props.client;
    if (client.schema) query.query = `schema=${client.schema}`;
    Router.go('adminDashboardclientsEdit', { _id: client._id }, query);
  }

  render() {
    // console.log(this.props.loading);
    // console.log(this.props.client);
    const { dob, ssn, race, ethnicity, gender, veteranStatus, suffix } = this.props.loading ?
      {} : this.props.client;
    return (
      <div className="tab-pane fade in show active" id="panel-overview" role="tabpanel">
        <div className="info-container">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6">
              <div className="">
                <p className="clabel">Suffix</p>
                <p className="cvalue">{suffix}</p>
              </div>
              <div className="">
                <p className="clabel">SSN</p>
                <p className="cvalue">{ssn}</p>
              </div>
              <div className="">
                <p className="clabel">Date of Birth</p>
                <p className="cvalue dob">{moment.utc(dob).format('MM/DD/YYYY')}</p>
              </div>
              <div className="">
                <p className="clabel">Race</p>
                <p className="cvalue">{getText('race', race)}</p>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6">
              <div className="">
                <p className="clabel">Ethnicity</p>
                <p className="cvalue">{getText('ethnicity', ethnicity)}</p>
              </div>
              <div className="">
                <p className="clabel">Gender</p>
                <p className="cvalue">{getText('gender', gender)}</p>
              </div>
              <div className="">
                <p className="clabel">Veteran Status</p>
                <p className="cvalue">{getText('veteranStatus', veteranStatus)}</p>
              </div>
            </div>
          </div>
          <input
            className="btn btn-warning edit"
            type="button" value="Edit client"
            onClick={this.edit}
          />
        </div>
      </div>
    );
  }
}

export default createContainer((props) => {
  const { clientId } = props.clientId;
  const handle = Meteor.subscribe('clients.one', clientId);
  return {
    loading: !handle.ready(),
    client: Clients.findOne({ _id: clientId }),
  };
}, ClientOverviewTab);
