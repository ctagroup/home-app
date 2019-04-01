import React from 'react';
export default class ClientProfile extends React.Component {
  render() {
    return (
      <div className="tab-pane fade show" id="panel-eligibility" role="tabpanel">
        <div className="row margin-top-35">
          <div className="col-xs-12">
            <h3>Matching Eligibility Status</h3>
            <div className="input-group js-datepicker">
              <span className="input-group-addon">
                <i className="fa fa-calendar"></i>
              </span>
              <input id="removalDate" className="set-removal-date form-control" type="text" />
            </div>
            <div className="form-group">
              <label>Choose a reason to delete: </label>
              <select
                className="removalReason form-control select2-hidden-accessible"
                name="removalReason" id="removalReason" tabIndex="-1" aria-hidden="true"
              >
                <option value="">Housed by CARS (include agency/program)</option>
                <option value="housed_externally">Housed externally</option>
                <option value="unreachable">Unreachable</option>
                <option value="insufficient_contact_information">Insufficient contact
                information</option>
                <option value="client_maxed_out_referral_offers">Client maxed out
                referral offers</option>
                <option value="client_no_longer_interested_in_services">Client no longer
                interested in services</option>
                <option value="">Other (specify)</option>
              </select>
              <span
                className="select2 select2-container select2-container--classNameic" dir="ltr"
              >
                <span
                  className="selection"
                >
                  <span
                    className="select2-selection select2-selection--single" role="combobox"
                    aria-haspopup="true" aria-expanded="false" tabIndex="0"
                    aria-labelledby="select2-removalReason-container"
                  >
                    <span
                      className="select2-selection__rendered" id="select2-removalReason-container"
                      title="Housed by CARS (include agency/program)"
                    >
                      <span
                        className="select2-selection__clear"
                      >×</span>
                      Housed by CARS (include agency/program)
                    </span>
                    <span
                      className="select2-selection__arrow" role="presentation"
                    >
                      <b role="presentation"></b>
                    </span>
                  </span>
                </span>
                <span
                  className="dropdown-wrapper" aria-hidden="true"
                ></span>
              </span>
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
