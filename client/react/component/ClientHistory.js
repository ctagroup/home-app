import React from 'react';

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

export default class ClientProfile extends React.Component {

  render() {
    return (
      <div className="tab-pane fade show" id="panel-eligibility" role="tabpanel">
        <div className="row margin-top-35">
          <div className="col-xs-12">
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
            />
          </div>
        </div>
      </div>
    );
  }
}
