/**
 * Created by Kavi on 4/5/16.
 */
const querystring = require('querystring');
import { Clients } from '/imports/api/clients/clients';
import { RecentClients } from '/imports/api/recent-clients';
import { logger } from '/imports/utils/logger';

Template.viewClient.onRendered(() => {
  $('body').addClass('sidebar-collapse');

  if (Roles.userIsInRole(Meteor.user(), ['Developer', 'System Admin'])) {
    $('a[data-toggle="tab"]').on('shown.bs.tab', (/* e */) => {

    });

    $('.js-summernote').summernote({
      minHeight: 100,
      fontNames: HomeConfig.fontFamilies,
    });
  }
});

Template.viewClient.onDestroyed(() => {
  $('body').removeClass('sidebar-collapse');
});

Template.viewClient.events(
  {
    'click .edit': (evt, tmpl) => {
      const query = {};
      const client = tmpl.data.client;
      if (client.schema) {
        query.query = `schema=${client.schema}`;
      }
      Router.go('adminDashboardclientsEdit', { _id: client._id }, query);
    },
    'click .back': () => {
      Router.go('adminDashboardclientsView');
    },
    'click .add-to-hmis': (event, tmpl) => {
      const client = tmpl.data.client;
      Meteor.call(
        'uploadPendingClientToHmis', client._id, (error, result) => {
          if (error) {
            Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
          } else {
            let query = 'addClientToHMISError=1';
            let clientId = client._id;
            if (result) {
              const params = {
                isHMISClient: true,
                schema: 'v2015',
              };
              clientId = result._id;
              query = querystring.stringify(params);
            }
            Bert.alert('Client uploaded to HMIS', 'success', 'growl-top-right');

            RecentClients.remove(client._id);
            Router.go('viewClient', { _id: clientId }, { query });
          }
        }
      );
    },
    'click .takeSurvey': (event, tmpl) => {
      const query = {};

      if (Router.current().params && Router.current().params.query
        && Router.current().params.query.schema) {
        query.query = {
          isHMISClient: true,
          schema: Router.current().params.query.schema,
        };
      }

      Router.go('selectSurvey', { _id: tmpl.data.client._id }, query);
    },
    'click .js-close-referral-status-modal': () => {
      $('#referralStatusComments').summernote('code', '');
      $('#referral-status-step').val('');
      $('#referralStatusUpdateCommentsModal').modal('hide');
    },
    'click .js-open-referral-status-modal': (event) => {
      if (Roles.userIsInRole(Meteor.user(), ['Developer', 'System Admin'])) {
        $('#referral-status-step').val($(event.currentTarget).data('step'));
        $('#referralStatusUpdateCommentsModal').modal(
          {
            keyboard: false,
            backdrop: false,
          }
        );
      }
    },
    'submit #update-referral-status': (event, tmpl) => {
      // update progress
      event.preventDefault();
      const step = $('#referral-status-step').val();
      const index = parseInt(step, 10);
      const total = HomeConfig.collections.clients.referralStatus.length;
      const percent = ((index + 1) / total) * 100;

      const cssClass = HomeConfig.collections.clients.referralStatus[index].cssClass;

      logger.log(`clicked status update${step}`);
      const status = step;
      const client = tmpl.data.client;
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

      let reservation = false;
      if (client.housingMatch) {
        reservation = client.housingMatch;
      }

      if (reservation) {
        let project = false;
        if (reservation.housingUnit) {
          project = reservation.housingUnit.project;
        }

        if (project) {
          const linkedUsers = users.find({ projectsLinked: project.projectId }).fetch();
          recipients.ccRecipients = linkedUsers.map(u => u.emails[0].address);
        }
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
            $('.progress-bar').css({ width: `${percent}%` });
            $('.progress-bar').text(`${index + 1} / ${total}`);
            $('.progress-bar').removeClass()
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
    },
    'click .getResponses'(evt, tmpl) {
      const clientID = tmpl.data.client._id;
      Router.go(`/responses?clientID=${clientID}`);
    },

    'click .addToHousingList'(evt, tmpl) {
      const clientId = tmpl.data.client._id;
      Meteor.call('ignoreMatchProcess', clientId, false, (err, res) => {
        if (err) {
          Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Client added to the matching process', 'success', 'growl-top-right');
          // We simulate update in client-side collection
          // Sadly, this cannot be done in meteor call (isSimulation)
          Clients._collection.update(clientId, { $set: { // eslint-disable-line
            'eligibleClient.ignoreMatchProcess': res.ignoreMatchProcess,
            'eligibleClient.remarks': res.remarks,
          } });
        }
      });
    },

    'click .removeFromHousingList'(evt, tmpl) {
      const clientId = tmpl.data.client._id;
      const remarks = $('#removalRemarks').val();

      if (remarks.trim().length === 0) {
        Bert.alert('Remarks are required', 'danger', 'growl-top-right');
        $('#removalRemarks').focus();
        return;
      }
      Meteor.call('ignoreMatchProcess', clientId, true, remarks, (err, res) => {
        if (err) {
          Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Client removed for the matching process', 'success', 'growl-top-right');
          // We simulate update in client-side collection
          // Sadly, this cannot be done in meteor call (isSimulation)
          Clients._collection.update(clientId, { $set: { // eslint-disable-line
            'eligibleClient.ignoreMatchProcess': res.ignoreMatchProcess,
            'eligibleClient.remarks': res.remarks,
          } });
        }
      });
    },
  }
);
