import moment from 'moment';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';
import { Questions } from '../../../imports/api/questions/questions';
import { getRace, getGender, getEthnicity, getYesNo } from '../../../imports/ui/clients/textHelpers.js';

 class ClientProfile extends React.Component {
  getText(text, code) {
    const definition = code === undefined ? '?' : code;
    // const question = this.props.Questions.findOne({ name: text });
    const intCode = parseInt(code, 10);
    // if (question && question.options) {
    //   const foundQuestion = question.options.find(
    //     (option) => parseInt(option.value, 10) === intCode);
    //   return foundQuestion ? foundQuestion.description : definition;
    // }
    switch (text) {
      case 'race': return getRace(intCode, definition);
      case 'ethnicity': return getEthnicity(intCode, definition);
      case 'gender': return getGender(intCode, definition);
      case 'veteranStatus':
      case 'disablingcondition': return getYesNo(intCode, definition);
      default: return definition;
    }
  }

  render() {
    //console.log(this.props.loading);
    console.log(this.props.client);
    const { dob, ssn, race, ethnicity, gender, veteranStatus, suffix } = this.props.loading ? {} : this.props.client;
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
                <p className="cvalue">{this.getText('race', race)}</p>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6">
              <div className="">
                <p className="clabel">Ethnicity</p>
                <p className="cvalue">{this.getText('ethnicity', ethnicity)}</p>
              </div>
              <div className="">
                <p className="clabel">Gender</p>
                <p className="cvalue">{this.getText('gender', gender)}</p>
              </div>
              <div className="">
                <p className="clabel">Veteran Status</p>
                <p className="cvalue">{this.getText('veteranStatus', veteranStatus)}</p>
              </div>
            </div>
          </div>
          <input className="btn btn-warning edit" type="button" value="Edit client" />
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
        client: Clients.findOne({ _id: clientId }),
    }
}, ClientProfile)