import React from 'react';
export default class ClientProfile extends React.Component {
  render() {
    return (
      <ul className="nav nav-tabs nav-justified">
        <li className="nav-item active">
          <a className="nav-link" data-toggle="tab" href="#panel-overview" role="tab">
          Overview</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#panel-eligibility" role="tab">History</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#panel-rois" role="tab">ROIs</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#panel-referrals" role="tab">Referrals</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#panel-enrollments" role="tab">
          Enrollments</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#panel-create-enrollment" role="tab">
          Create Enrollment</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#panel-client-tags" role="tab">Tags</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-toggle="tab" href="#panel-services" role="tab">Services</a>
        </li>
      </ul>
    );
  }
}
