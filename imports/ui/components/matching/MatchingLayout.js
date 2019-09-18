import moment from 'moment';
import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Alert from '/imports/ui/alert';


function MatchingLayout({ dedupClientId, helpers, handleDataReload, permissions }) {
  // TODO: make reactive:
  const projectList =
    helpers && helpers.getProjects && helpers.getProjects() || [];
  const [values, setValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCreateReferral = () => {
    setIsSubmitting(true);
    Meteor.call('matching.createMatch',
      dedupClientId,
      values.projectId,
      moment(values.startDate).format('YYYY-MM-DD'),
      (err) => {
        setIsSubmitting(false);
        if (err) {
          Alert.error(err);
        } else {
          Alert.success('Referral created');
          handleDataReload();
        }
      }
    );
  };

  return (
    <div className="">
      <div className="row">
        <div className="col-md-2">
          <label htmlFor="projectId"> Select Project </label>
          <div className="form-group">
            <Select
              // value={newTagId}
              onChange={(option) => handleChange('projectId', option.id)}
              options={projectList}
              placeholder="Select Project:"
            />
          </div>
        </div>
        <div className="col-md-2 col-xs-6">
          <label htmlFor="startDate-date"> Start Date </label>
          <div className="form-group">
            {renderDatePicker('startDate')}
          </div>
        </div>
        {/*
        <div className="col-md-2 col-xs-6">
          <label htmlFor="endDate-date"> End Date </label>
          <div className="form-group">
            {renderDatePicker('endDate')}
          </div>
        </div>
         */}
      </div>
      <div className="row">
        <div className="col-md-2 col-xs-6">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateReferral}
            disabled={isSubmitting || !permissions.canCreateReferrals}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchingLayout;
