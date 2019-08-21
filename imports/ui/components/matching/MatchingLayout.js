import moment from 'moment';
import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Alert from '/imports/ui/alert';

// import RecepientsList from './RecepientsList';

function MatchingLayout({ dedupClientId, helpers, handleDataReload }) {
  // TODO: make reactive:
  const projectList =
    helpers && helpers.getProjects && helpers.getProjects() || [];
  const [values, setValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [recepients, setRecepients] = useState([]);

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
            disabled={isSubmitting}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
  /*
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
  */
}

export default MatchingLayout;
