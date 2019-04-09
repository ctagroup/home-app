import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';
import { Mongo } from 'meteor/mongo';
import DataTable2 from '../../../imports/ui/components/dataTable/DataTable2';

import UserServices from '/imports/api/userServices/userServices';
import servicesList from '../helpers/servicesProject';
import services from '../helpers/services';

Meteor.subscribe('userServices.all');

class ClientServices extends React.Component {
	state = {
		project: '',
		service: '',
		date: '',
		qty: '',
		cost: '',
		description: ''
	}
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.addServices = this.addServices.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleQtyChange = this.handleQtyChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCostChange = this.handleCostChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.getServices = this.getServices.bind(this);
  }

  handleProjectChange(e) {
	  this.setState({project: e.target.value});
	}

	handleServiceChange(e) {
	  this.setState({service: e.target.value});
	}

	handleQtyChange(e) {
	  this.setState({qty: e.target.value});
	}

	handleDateChange(e) {
	  this.setState({date: e.target.value});
	}

	handleCostChange(e) {
	  this.setState({cost: e.target.value});
	}

	handleDescriptionChange(e) {
	  this.setState({description: e.target.value});
	}

  addServices(evt) {
  	event.preventDefault();
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;

    UserServices.insert({clientId:client._id,project:this.state.project,service:this.state.service,qty:this.state.qty,date:this.state.date,cost:this.state.cost,description:this.state.description});
  }

  getServices(){
  	if(this.props.loading){
      return [];
    }
  	return UserServices.find({clientId:this.props.client._id}).fetch();
  }

  render() {
  	// console.log(this.getServices());
  	// TODO: needed columns: tagId, action, appliedOn, appliedBy, remove
    const clientTags = this.getServices(); //this.props;
    const selectedDate = '';//this.getDate();
    const activeTagNames = [{}]; //getActiveTagNamesForDate(clientTags, selectedDate);

    const tableOptions = {
      columns: [
        {
          title: 'Project Name',
          data: 'project',
          render(value, op, doc) {
          	let project='';
          	for(let i=0;i<servicesList.length;i++){
          		if(servicesList[i].id==value){
          			project=servicesList[i].text;
          		}
          	}
            return project;
          },
        },
        {
          title: 'Service Name',
          data: 'service',
          render(value, op, doc) {
            return value;
          },
        },
        {
          title: 'Service Date',
          data: 'date',
          render(value, op, doc) {
            return value;
          },
        },
        {
          title: 'Service Qty',
          data: 'qty',
          render(value, op, doc) {
            return value;
          },
        },
        {
          title: 'Cost Currency',
          data: 'cost',
          render(value, op, doc) {
            return value;
          },
        },
        {
          title: 'Description',
          data: 'description',
          render(value, op, doc) {
            return value;
          },
        },
      ],
    };

    const options = tableOptions;

    const disabled = true;
    // const { maskedValue } = this.state;
    // resolveData={data => data.filter(({ appliedOn }) => appliedOn < activeDateInMs)}

    // TODO: move padding to style

    const listOfActiveTags = 'none'; //activeTagNames.length > 0 ?  activeTagNames.join(', ') : 'none';

    return (
      <div className="tab-pane fade show" id="panel-services" role="tabpanel">
        <div className="row margin-top-35">
          <div className="col-xs-12">
            <h3>Add Services</h3>
            <form className="form-horizontal" role="form">
              <div className="form-group row">
                <div className="col-md-2">
                  <label>select Project</label>
                  <select
                    name="className" className="service_project form-control" id="service_project"
                    value={this.state.project} onChange={this.handleProjectChange} 
                  >
                    {servicesList.map((serviceProject) => (
		                      <option value={serviceProject.id}>{serviceProject.text}</option>
		                  ))} 
                  </select>
                </div>
                <div className="col-md-2">
                  <label>select Service</label>
                  <select name="className" className="service_type form-control" id="service_type"
                    value={this.state.service} onChange={this.handleServiceChange} 
                  >
                    {services.map((service) => (
		                      <option value={service.id}>{service.text}</option>
		                  ))} 
                  </select>
                </div>
                <div className="col-md-2">
                  <label>Service Date</label>
                  <div className="input-group js-datepicker">
                    <span className="input-group-addon">
                      <i className="fa fa-calendar"></i>
                    </span>
                    <input
                      id="serviceDate" className="serviceDate form-control" type="text"
                      value={this.state.date} onChange={this.handleDateChange}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <label>Service Qty</label>
                  <div className="input-group">
                    <input id="serviceQty" className="serviceQty form-control" type="text"
                    value={this.state.qty} onChange={this.handleQtyChange}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <label>Cost Currency</label>
                  <div className="input-group">
                    <input
                      id="servicecostcurrency" className="servicecostcurrency form-control"
                      type="text"
                      value={this.state.cost} onChange={this.handleCostChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-10">
                  <label>Description</label>
                  <div className="input-group">
                    <textarea className="serviceDescription form-control"
                      value={this.state.description} onChange={this.handleDescriptionChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <input
                    type="submit" value="Add service" id="service_submit"
                    className="btn btn-primary service_submit"
                    onClick={this.addServices}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="row margin-top-35">
          <h3>Services List</h3>
          <DataTable2
            disableSearch={disabled}
            options={options}
            data={clientTags}
          />
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
}, ClientServices)