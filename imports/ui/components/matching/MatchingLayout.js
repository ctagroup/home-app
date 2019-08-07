import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import RecepientsList from './RecepientsList';

function MatchingLayout(props) {
  const projectList = [];

  const renderDatePicker = (key) => {
    const dateValue =
      this.state && this.state[key] && moment(this.state[key]).toDate() || new Date;
    return (<DatePicker
      id={`${key}-date`}
      inline
      className="form-control"
      selected={dateValue}
      onChange={(value) => this.handleChange(key, value)}
      placeholderText="MM/DD/YYYY"
    />);
  };

//   handleChange(key, input) {
//     this.setState({ [key]: input });
//   }
// Referral Status List


  return (
    <div className="container">
      <div className="col-md-4">
        <label htmlFor="projectId"> Select Project </label>
        <div className="form-group">
          <Select
            // value={newTagId}
            onChange={(option) => this.handleChange('newTagId', option)}
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
          <label htmlFor="removalRemarks"> Subject </label>
          <input
            id="removalRemarks"
            className="form-control"
            type="text"
            name="removalRemarks"
            placeholder="Removal notes"
            onChange={(e) => this.handleChange(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="removalRemarks"> Body </label>
          <textarea
            rows="3"
            placeholder="note"
            className="form-control input-sm"
            onChange={(value) => this.handleChange('note', value)}
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
        <RecepientsList />
      </div>
    </div>
  );
}

export default MatchingLayout;
