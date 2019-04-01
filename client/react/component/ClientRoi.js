import React from 'react';
export default class ClientProfile extends React.Component {
  render() {
    return (
      <div className="tab-pane fade show" id="panel-rois" role="tabpanel">
        <div className="row margin-top-35">
          <div className="col-xs-12">
            <p className="alert alert-error">Error: Internal server error [500]</p>
            <a href="" className="btn btn-primary">
              <i className="fa fa-plus"></i> New ROI
            </a>
          </div>
        </div>
      </div>
    );
  }
}
