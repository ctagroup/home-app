import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';

class ClientRoi extends React.Component {
  render() {
    const { dedupClientId } = this.props.loading ? {} : this.props.client;
    const reflink = '/rois/new?dedupClientId=' + dedupClientId;
    return (
      <div className="tab-pane fade show" id="panel-rois" role="tabpanel">
        <div className="row margin-top-35">
          <div className="col-xs-12">
            <a href={reflink} className="btn btn-primary">
              <i className="fa fa-plus"></i> New ROI
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer((props) => {
  const { clientId } = props.clientId;
  const handle = Meteor.subscribe('clients.one', clientId);

  return {
    loading: !handle.ready(),
    client: Clients.findOne({ _id: clientId }),
  };
}, ClientRoi);
