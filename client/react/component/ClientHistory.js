import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';
import reasons from '../helpers/reasons';
import DatePicker from 'react-datepicker';

const reasonsHash = reasons.reduce((acc, reason) => ({ ...acc, [reason.id]: reason }), {});

class ClientHistory extends React.Component {
  state = {
		showform: true,
    removalRemarks: '',
    removalDate: '',
    removalReason: '',
    showReason: true,
	}

  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.removeFromHousingList = this.removeFromHousingList.bind(this);
    this.remarks = this.remarks.bind(this);
    this.getEligibleClient = this.getEligibleClient.bind(this);
    this.ignoreMatchProcess = this.ignoreMatchProcess.bind(this);
    this.addToHousingList = this.addToHousingList.bind(this);
    this.handleRemovalRemarks = this.handleRemovalRemarks.bind(this);
    this.handleRemovalDate = this.handleRemovalDate.bind(this);
    this.handleRemovalReason = this.handleRemovalReason.bind(this);
  }

  handleRemovalRemarks(e){
    this.setState({removalRemarks: e.target.value});
  }

  handleRemovalDate(date){
    this.setState({removalDate: date});
  }

  handleRemovalReason(e){
    this.setState({removalReason: e.target.value});

    if( e.target.value == 'housed_by_cars_(include_agency/program)' || e.target.value == 'other_(specify)'){
      this.setState({showReason: true});
    } else {
      this.setState({showReason: false});
    }
  }

  removeFromHousingList(evt) {
  	event.preventDefault();
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    // drop not found:
    const clientVersions = client.clientVersions
      .filter(({ clientId, schema }) => {
        const data = client[`eligibleClient::${schema}::${clientId}`];
        return data && !data.error;
      });
    const clientIds = clientVersions.map(({ clientId }) => clientId);

    const remarks = this.state.removalRemarks;
    const date = this.state.removalDate;
    const reasonId = this.state.removalReason;

    if (reasonsHash[reasonId].required && remarks.trim().length === 0) {
      Bert.alert('Remarks are required', 'danger', 'growl-top-right');
      $('#removalRemarks').focus();
      return;
    }
    if (date.length === 0) {
      Bert.alert('Removal Date required', 'danger', 'growl-top-right');
      $('#removalDate').focus();
      return;
    }
    const reason = reasonsHash[reasonId];
    let removeReasons = reason.text;
    if (reason.required) removeReasons = `${removeReasons} | ${remarks}`;
    removeReasons = `${removeReasons} | ${date}`;

    // Optimistic UI approach:
    const changes = clientVersions.reduce((acc, { clientId, schema }) => ({
      ...acc,
      [`eligibleClient::${schema}::${clientId}.ignoreMatchProcess`]: true,
      [`eligibleClient::${schema}::${clientId}.remarks`]: removeReasons,
    }), {});

    Meteor.call('ignoreMatchProcess', clientIds, true, removeReasons, (err) => {
      if (err) {
        Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Client removed for the matching process', 'success', 'growl-top-right');
        // We simulate update in client-side collection
        // Sadly, this cannot be done in meteor call (isSimulation)
        Clients._collection.update(client._id, { $set: changes }); // eslint-disable-line
      }
    });
  }

  addToHousingList(evt) {
    event.preventDefault();
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    const currentClientId = client._id;
    // drop not found:
    const clientVersions = client.clientVersions
      .filter(({ clientId, schema }) => {
        const data = client[`eligibleClient::${schema}::${clientId}`];
        return data && !data.error;
      });
    const clientIds = clientVersions.map(({ clientId }) => clientId);
    // Optimistic UI approach:
    const changes = clientVersions.reduce((acc, { clientId, schema }) => ({
      ...acc,
      [`eligibleClient::${schema}::${clientId}.ignoreMatchProcess`]: false,
      [`eligibleClient::${schema}::${clientId}.remarks`]: 'Restored to active list by user',
    }), {});

    Meteor.call('ignoreMatchProcess', clientIds, false, (err /* , res*/) => {
      if (err) {
        Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Client added to the matching process', 'success', 'growl-top-right');
        // We simulate update in client-side collection
        // Sadly, this cannot be done in meteor call (isSimulation)
        Clients._collection.update(currentClientId, { $set: changes }); // eslint-disable-line
      }
    });
  }

	getEligibleClient(clientId, schema){
		const client = this.props.client;
		return client[`eligibleClient::${schema}::${clientId}`];
	}

	ignoreMatchProcess(){
		if(this.props.loading){
      return '';
    }
		const client = this.props.client;
		const clientVersions = client.clientVersions
	    .filter(({ clientId, schema }) => {
	      const data = this.getEligibleClient(clientId, schema);
	      if(data){
		      return data.ignoreMatchProcess;
		    }
	    });
		return clientVersions;
	}


  remarks() {
  	if(this.props.loading){
      return '';
    }
  	const client = this.props.client;
	  
	  // drop not found:
	  const clientVersions = client.clientVersions
	    .filter(({ clientId, schema }) => {
	      const data = this.getEligibleClient(clientId, schema);
	      return data && !data.error;
	    });
	  const ignored = clientVersions.find(({ clientId, schema }) => {
	    const data = this.getEligibleClient(clientId, schema);
	    return data.ignoreMatchProcess;
	  });
    
    if(ignored){
	  	return this.getEligibleClient(ignored.clientId, ignored.schema).remarks;
	  }
  }

  render() {
    return (
      <div className="tab-pane fade show" id="panel-eligibility" role="tabpanel">
        <div className="row margin-top-35">
          <div className="col-xs-12">
            {this.remarks() ? (
              <div class="form-group">
                <h3>Matching Eligibility Status</h3>
                <p><strong>Removal notes: </strong>{this.remarks()}</p>
                <input 
	                class="btn btn-warning addToHousingList"
	                value="Add client to active list"
	                type="button"
	                onClick={this.addToHousingList}
	              />
              </div>
              ) : ( 
              <div>
	              <h3>Matching Eligibility Status</h3>
                <DatePicker
                  selected={this.state.removalDate}
                  onChange={this.handleRemovalDate}
                  onSelect={this.handleRemovalDate}
                />
	              
		            <div className="form-group custom_select">
		              <label>Choose a reason to delete: </label>
		              <select
		                className="removalReason form-control"
		                name="removalReason" id="removalReason" tabIndex="-1" aria-hidden="true"
                    onChange={this.handleRemovalReason}
		              >
		                  {reasons.map((reason) => (
		                      <option value={reason.id}>{reason.text}</option>
		                  ))}      
		              </select>
		            </div>
                {this.state.showReason ? (
  		            <div className="form-group">
  		              <label> Additional notes </label>
  		              <input
  		                id="removalRemarks" className="form-control" type="text"
  		                name="removalRemarks" placeholder="Removal notes"
                      onChange={this.handleRemovalRemarks}
  		              />
  		            </div>
                  ) : ''
                }
		            <input
		              className="btn btn-danger removeFromHousingList"
		              value="Remove client from active list" type="button"
		              onClick={this.removeFromHousingList}
		            />
	            </div>
	            )
            }
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
}, ClientHistory)