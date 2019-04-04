import React from 'react';
import ReferralStatusList from '../../../imports/ui/clients/referralStatusList';
import { createContainer } from 'meteor/react-meteor-data';
import { Clients } from '../../../imports/api/clients/clients';
import { logger } from '/imports/utils/logger';

//console.log(ReferralStatusList);

class ClientReferrals extends React.Component {
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    console.log(ReferralStatusList);
    if(this.props.loading){
      return '';
    }
    const step = $('#referral-status-step').val();
    const index = parseInt(step, 10);
    const total = ReferralStatusList.length;
    const percent = ((index + 1) / total) * 100;
    
    const cssClass = 'primary'; //ReferralStatusList[index].cssClass;
    const client = this.props.client;
    logger.log(`clicked status update${step}`);
    const status = step;
    const clientId = client._id;
    const recipients = { toRecipients: [], ccRecipients: [], bccRecipients: [] };

    const user = Meteor.user();
    if (user && user.emails) {
      recipients.toRecipients = [user.emails[0].address];
    }

    const emails = $('#recipients').val();
    if (emails) {
      recipients.toRecipients = recipients.toRecipients.concat(emails.split(','));
    }

    if (
      client.housingMatch &&
      client.housingMatch.housingUnit &&
      client.housingMatch.housingUnit.project) {
      const projectId = client.housingMatch.housingUnit.project.projectId;
      const linkedUsers = Users.find({ projectsLinked: projectId }).fetch();
      recipients.ccRecipients = linkedUsers.map(u => u.emails[0].address);
    }

    Meteor.call(
     'updateClientMatchStatus',
      clientId,
      status,
      $('#referralStatusComments').summernote('code'),
      recipients,
      (err, res) => {
        if (err) {
          logger.log(err);
          Bert.alert('Error updating client match status.', 'danger', 'growl-top-right');
        } else {
          logger.log(res);
          const progressSelector = $('.progress-bar');
          progressSelector.css({ width: `${percent}%` });
          progressSelector.text(`${index + 1} / ${total}`);
          progressSelector.removeClass()
            .addClass(`progress-bar progress-bar-${cssClass} progress-bar-striped active`);

          // $('#referral-timeline .navigation a').removeClass()
          //   .addClass('btn btn-sm btn-arrow-right btn-default');
          $(`#js-btn-step-${step}`).removeClass('btn-default').addClass(`btn-${cssClass}`);
          // e.relatedTarget // previous tab

          // close the modal
          $('.js-close-referral-status-modal').click();
        }
      }
    );
  }

  getLastStatus(){
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    //console.log(client);
    //console.log("client information");
    if(client.referralStatusHistory){
      return client.referralStatusHistory[client.referralStatusHistory.length - 1];
    }else{
      return 0;
    }
  }

  getStatusTooltip(step) {
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    let history = ReferralStatusList[step].desc;
    (client.referralStatusHistory || []).forEach((item) => {
      if (item.status === step) {
        const txt = item.statusDescription || item.comments;
        history = `${history}<br />${item.dateUpdated} - ${txt}`;
      }
    });
    return history;
  }

  isReferralStatusActiveButton(step) {
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    const lastStatus = this.getLastStatus(client.referralStatusHistory);
    if (lastStatus) {
      if (step <= lastStatus.status) return 'btn btn-sm btn-arrow-right js-open-referral-status-modal js-tooltip btn-'+ReferralStatusList[step].cssClass;
    } else if (client.matchingScore && step <= 0) {
      return 'btn btn-sm btn-arrow-right js-open-referral-status-modal js-tooltip btn-'+ReferralStatusList[step].cssClass;
    }
    return 'btn btn-sm btn-arrow-right js-open-referral-status-modal js-tooltip btn-default';
  }

  getProgressbarActiveStatus() {
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    const lastStatus = this.getLastStatus(client.referralStatusHistory);
    let cssClass = 'default';
    if (lastStatus) {
      cssClass = ReferralStatusList[lastStatus.status].cssClass;
    } else if (client.matchingScore) {
      cssClass = ReferralStatusList[0].cssClass;
    }
    return 'progress-bar progress-bar-striped active progress-bar-'+cssClass;
  }

  getCurrentReferralStatus() {
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    const lastStatus = this.getLastStatus(client.referralStatusHistory);
    if (lastStatus) return lastStatus.status + 1;
    if (client.matchingScore) return 1;
    return 0;
  }

  getProgressbarWidth() {
    if(this.props.loading){
      return '';
    }
    const client = this.props.client;
    const total = ReferralStatusList.length;
    const lastStatus = this.getLastStatus(client.referralStatusHistory);
    let status = -1;
    if (lastStatus) {
      status = lastStatus.status;
    } else if (client.matchingScore) {
      status = 0;
    }
    const sty = ((status + 1) / total) * 100;
    return sty+'%';
  }

  render() {
    return (
      <div className="tab-pane fade show" id="panel-referrals" role="tabpanel">
        <div className="row">
          <div className="col-xs-12">
            <h3>Referral Status</h3>
            <div className="row">
              <div className="col-xs-9 my-center-block">
                <div id="referral-timeline">
                  <div className="navigation">
                    {ReferralStatusList.map((referral, index) => (
                      <span
                        className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                        title={this.getStatusTooltip(referral.step)}
                      >
                        <a
                          id={'js-btn-step-'+index} className={this.isReferralStatusActiveButton(referral.step)}
                          href={'#step'+referral.step} data-toggle="tab"
                          data-step={referral.step} aria-expanded="true"
                        >{referral.title}</a>
                      </span>
                    ))} 
                  </div>
                  <div className="progress">
                    <div
                      className={this.getProgressbarActiveStatus()}
                      role="progressbar" aria-valuenow={this.getCurrentReferralStatus()} aria-valuemin="1"
                      aria-valuemax={ReferralStatusList.length}
                      style={{width: this.getProgressbarWidth()}}
                    >{this.getCurrentReferralStatus()} / {ReferralStatusList.length}</div>
                  </div>
                  <div
                    className="modal fade modal-fullscreen" id="referralStatusUpdateCommentsModal"
                    tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title text-center">Update Referral Status</h1>
                        </div>
                        <form id="custom-update-referral-status">
                          <div className="modal-body content">
                            <div className="row">
                              <div className="col-xs-12 col-sm-6 col-md-6 my-center-block">
                                <input
                                  type="hidden" name="referral-status-step"
                                  id="referral-status-step" value=""
                                />
                                <div id="referralStatusComments" class="custom-js-summernote"></div>
                              </div>
                            </div>
                            <div className="row margin-top-20">
                              <div className="col-xs-12 col-sm-6 col-md-6 my-center-block">
                                <label className="control-label">Recipients:</label>
                                <input
                                  type="email" className="form-control" id="recipients"
                                  size="80"
                                  title="Comma separated email addresses."
                                  placeholder="Comma separated email addresses." multiple=""
                                />
                              </div>
                            </div>
                            <div className="row margin-top-35">
                              <div className="col-xs-7 col-md-6 col-lg-4 my-center-block">
                                <div className="row">
                                  <div className="col-xs-6">
                                    <input
                                      type="submit"
                                      className="btn btn-lg btn-success btn-block js-update-referral-status"
                                      value="Submit" onClick={this.handleClick}
                                    />
                                  </div>
                                  <div className="col-xs-6">
                                    <input
                                      type="button"
                                      className="btn btn-lg btn-default btn-block js-close-referral-status-modal"
                                      value="Cancel"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="modal-footer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer((props) => {
    const {clientId} = props.clientId;
    const handle = Meteor.subscribe('clients.one', clientId);
    
    return {
        loading: !handle.ready(),
        client: Clients.findOne({ _id: clientId })
    }
}, ClientReferrals)