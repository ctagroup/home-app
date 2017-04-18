/**
 * Created by Kavi on 4/5/16.
 */
const querystring = require('querystring');

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
      if (tmpl.data.schema) {
        query.query = `schema=${tmpl.data.schema}`;
      }
      Router.go('adminDashboardclientsEdit', { _id: tmpl.data._id }, query);
    },
    'click .back': () => {
      Router.go('adminDashboardclientsView');
    },
    'click .add-to-hmis': (event, tmpl) => {
      Meteor.call(
        'uploadPendingClientToHmis', tmpl.data._id, (error, result) => {
          if (error) {
            Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
          } else {
            let query = 'addClientToHMISError=1';
            let clientId = tmpl.data._id;
            if (result) {
              const params = {
                isHMISClient: true,
                schema: 'v2015',
              };
              clientId = result._id;
              query = querystring.stringify(params);
            }
            Bert.alert('Client uploaded to HMIS', 'success', 'growl-top-right');
            Router.go('viewClient', { _id: clientId }, { query });
          }
        }
      );
    },
    'click .takeSurvey': (event, tmpl) => {
      const query = {};

      if (Router.current().params && Router.current().params.query
        && Router.current().params.query.isHMISClient && Router.current().params.query.schema) {
        query.query = {
          isHMISClient: true,
          schema: Router.current().params.query.schema,
        };
      }

      Router.go('selectSurvey', { _id: tmpl.data._id }, query);
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
      const clientId = tmpl.data._id;
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
      if (tmpl.data.housingMatch) {
        reservation = tmpl.data.housingMatch;
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
      const clientID = tmpl.data._id;
      Router.go(`/responses?clientID=${clientID}`);
    },

    'click .addToHousingList'(evt, tmpl) {
      const clientId = tmpl.data._id;
      Meteor.call('ignoreMatchProcess', clientId, false, (err) => {
        if (err) {
          Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Client added to the matching process', 'success', 'growl-top-right');

          // TODO: it would be better to directly update the client's document in MongoDb
          // however, there is no client-side only collection for clients to update
          // and current client is not held on the server side as well
          window.location.reload();
        }
      });
    },

    'click .removeFromHousingList'(evt, tmpl) {
      const clientId = tmpl.data._id;
      const remarks = $('#removalRemarks').val();

      if (remarks.trim().length === 0) {
        Bert.alert('Remarks are required', 'danger', 'growl-top-right');
        $('#removalRemarks').focus();
        return;
      }
      Meteor.call('ignoreMatchProcess', clientId, true, remarks, (err) => {
        if (err) {
          Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Client removed for the matching process', 'success', 'growl-top-right');

          // TODO: it would be better to directly update the client's document in MongoDb
          // however, there is no client-side only collection for clients to update
          // and current client is not held on the server side as well
          window.location.reload();
        }
      });
    },
  }
);
