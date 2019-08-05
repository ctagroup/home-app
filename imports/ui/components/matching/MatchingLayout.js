import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

function MatchingLayout(props) {
  const projectList = [];

  const renderDatePicker = (key) => {
    const dateValue =
      this.state && this.state[key] && moment(this.state[key]).toDate() || new Date;
    return (<DatePicker
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
    <div>
      <Select
        // value={newTagId}
        onChange={(option) => this.handleChange('newTagId', option)}
        options={projectList}
        placeholder="Select tag:"
      />
      {renderDatePicker('startDate')}
      {renderDatePicker('endDate')}
      <div className="form-group">
        <label htmlFor="removalRemarks"> Additional notes </label>
        <input
          id="removalRemarks"
          className="form-control"
          type="text"
          name="removalRemarks"
          placeholder="Removal notes"
          onChange={(e) => this.handleChange(e.target.value)}
        />
      </div>
      <textarea
        rows="3"
        placeholder="note"
        className="form-control input-sm"
        onChange={(value) => this.handleChange('note', value)}
      />
      <label>
        <input
          type="checkbox"
          value={this.showDebugWindow}
          onClick={this.handleToggleDebugWindow}
        />
        System admins
      </label>

      <div className="input-group">
        <span className="input-group-addon" id="basic-addon1">@</span>
        <input
          type="text"
          className="form-control"
          placeholder="someEmail"
          aria-describedby="basic-addon1"
        />
      </div>
    </div>
  );
}

export default MatchingLayout;
