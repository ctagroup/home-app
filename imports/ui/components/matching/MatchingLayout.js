import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import RecepientsList from './RecepientsList';
import ReferralSteps from '../referrals/Steps';

function MatchingLayout(props) {
  const projectList = props.projectList || [];
  const [values, setValues] = useState({});
  const [recepients, setRecepients] = useState([]);

  const handleChange = (key, value) => setValues({ ...values, [key]: value });

  const renderDatePicker = (key) => {
    const dateValue =
      values[key] && moment(values[key]).toDate() || new Date;
    return (<DatePicker
      id={`${key}-date`}
      inline
      className="form-control"
      selected={dateValue}
      onChange={(value) => handleChange(key, value)}
      placeholderText="MM/DD/YYYY"
    />);
  };

//   handleChange(key, input) {
//     this.setState({ [key]: input });
//   }
// Referral Status List


  return (
    <div className="container">
      <ReferralSteps />
      <div className="col-md-4">
        <label htmlFor="projectId"> Select Project </label>
        <div className="form-group">
          <Select
            // value={newTagId}
            onChange={(option) => handleChange('projectId', option)}
            options={projectList}
            placeholder="Select Project:"
          />
        </div>
      </div>
      <div className="col-md-3 col-xs-6">
        <label htmlFor="startDate-date"> Start Date </label>
        <div className="form-group">
          {renderDatePicker('startDate')}
        </div>
      </div>
      <div className="col-md-3 col-xs-6">
        <label htmlFor="endDate-date"> End Date </label>
        <div className="form-group">
          {renderDatePicker('endDate')}
        </div>
      </div>
      <div className="col-xs-12">
        <div className="form-group">
          <label htmlFor="subject"> Subject </label>
          <input
            id="subject"
            className="form-control"
            type="text"
            name="subject"
            placeholder="Subject"
            onChange={(e) => handleChange('subject', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="removalRemarks"> Body </label>
          <textarea
            rows="3"
            placeholder="Email text"
            className="form-control input-sm"
            onChange={(value) => this.handleChange('body', value)}
          />
        </div>
      </div>
      <div className="col-xs-12 col-md-6">
        <label>
          <input
            type="checkbox"
            value={this.showDebugWindow}
            onClick={this.handleToggleDebugWindow}
          />
          System admins
        </label>
      </div>
      <div className="col-xs-12 col-md-6">
        <RecepientsList recepients={recepients} setRecepients={setRecepients} />
      </div>
    </div>
  );
}

export default MatchingLayout;
