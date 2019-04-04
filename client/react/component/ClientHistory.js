import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';


const reasons = [
    { required: true, text: 'Housed by CARS (include agency/program)' },
    { required: false, text: 'Housed externally' },
    { required: false, text: 'Unreachable' },
    { required: false, text: 'Insufficient contact information' },
    { required: false, text: 'Client maxed out referral offers' },
    { required: false, text: 'Client no longer interested in services' },
    { required: true, text: 'Other (specify)' },
  ].map(({ text, required }) => ({
    id: text.replace(/\s+/g, '_').toLowerCase(),
    text,
    required,
  }));

const reasonsHash = reasons.reduce((acc, reason) => ({ ...acc, [reason.id]: reason }), {});

class ClientHistory extends React.Component {
  state = {
		showform: true
	}

  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.removeFromHousingList = this.removeFromHousingList.bind(this);
    this.remarks = this.remarks.bind(this);
    this.getEligibleClient = this.getEligibleClient.bind(this);
    this.ignoreMatchProcess = this.ignoreMatchProcess.bind(this);
    this.addToHousingList = this.addToHousingList.bind(this);
  }

  removeFromHousingList(evt) {
  	event.preventDefault();
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    console.log(client);
    // drop not found:
    const clientVersions = client.clientVersions
      .filter(({ clientId, schema }) => {
        const data = client[`eligibleClient::${schema}::${clientId}`];
        return data && !data.error;
      });
    const clientIds = clientVersions.map(({ clientId }) => clientId);

    const remarks = $('#removalRemarks').val();
    const date = $('#removalDate').val();
    const reasonId = $('#removalReason').val();

    if (reasonsHash[reasonId].required && remarks.trim().length === 0) {
      Bert.alert('Remarks are required', 'danger', 'growl-top-right');
      $('#removalRemarks').focus();
      return;
    }
    if (date.trim().length === 0) {
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

 //  eligibleClient() {
 //  	if(this.props.loading){
 //      return '';
 //    }
 //    // TODO [VK]: check by updated at instead of schema version
 //    const client = this.props.client;
 //    if (!client) return null;
 //    const versions = this.flattenKeyVersions(client, 'eligibleClient');
 //    const nonError = versions.filter(({ error }) => !error);
 //    if (nonError.length) {
 //      this.updateEligibility();
 //      return nonError[nonError.length - 1];
 //    }
 //    return versions[versions.length - 1];
 //  }

 //  flattenKeyVersions(client, key){
	//   const keyVersions = client.clientVersions
	//     .map(({ clientId, schema }) => client[`${key}::${schema}::${clientId}`])
	//     .filter((value) => !!value);
	//   const mongoKey = client[key] || [];
	//   return _.flatten([keyVersions, mongoKey]);
	// }

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
	      if(!!(data)){
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
    
    if(!!(ignored)){
	  	return this.getEligibleClient(ignored.clientId, ignored.schema).remarks;
	  }
  }

	// updateEligibility(){
	// 	const client = this.props.client;
	//   const currentClientId = client._id;
	  
	//   // drop not found:
	//   const clientVersions = client.clientVersions
	//     .filter(({ clientId, schema }) => {
	//       const data = this.getEligibleClient(clientId, schema);
	//       return data && !data.error;
	//     });
	//   const ignored = clientVersions.find(({ clientId, schema }) => {
	//     const data = this.getEligibleClient(clientId, schema);
	//     return data.ignoreMatchProcess;
	//   });
	//   const updateRequired = clientVersions.filter(({ clientId, schema }) => {
	//     const data = this.getEligibleClient(clientId, schema);
	//     return (!data.updating) && !data.ignoreMatchProcess;
	//   });
	//   if (ignored && updateRequired.length) {
	//     const remarks = this.getEligibleClient(ignored.clientId, ignored.schema).remarks;
	//     const clientIds = updateRequired.map(({ clientId }) => clientId);
	//     // mark updating client versions:
	//     const updating = updateRequired.reduce((acc, { clientId, schema }) =>
	//       ({ ...acc, [`eligibleClient::${schema}::${clientId}.updating`]: true }), {});
	//     Clients._collection.update(currentClientId, { $set: updating});  // eslint-disable-line
	//     Meteor.call('ignoreMatchProcess', clientIds, true, remarks, (err) => {
	//       if (!err) {
	//         const changes = updateRequired.reduce((acc, { clientId, schema }) => ({
	//           ...acc,
	//           [`eligibleClient::${schema}::${clientId}.ignoreMatchProcess`]: true,
	//           [`eligibleClient::${schema}::${clientId}.remarks`]: remarks,
	//           [`eligibleClient::${schema}::${clientId}.updating`]: false,
	//         }), {});
	//         Clients._collection.update(currentClientId, { $set: changes});  // eslint-disable-line
	//       }
	//     });
	//   }
	// }

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
	              <div className="input-group custom-datepicker">
		              <span className="input-group-addon">
		                <i className="fa fa-calendar"></i>
		              </span>
		              <input id="removalDate" className="set-removal-date form-control" type="text" />
		            </div>
		            <div className="form-group custom_select">
		              <label>Choose a reason to delete: </label>
		              <select
		                className="removalReason form-control"
		                name="removalReason" id="removalReason" tabIndex="-1" aria-hidden="true"
		              >
		                  {reasons.map((reason) => (
		                      <option value={reason.id}>{reason.text}</option>
		                  ))}      
		              </select>
		            </div>
		            <div className="form-group">
		              <label> Additional notes </label>
		              <input
		                id="removalRemarks" className="form-control" type="text"
		                name="removalRemarks" placeholder="Removal notes"
		              />
		            </div>
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