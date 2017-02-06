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
      if (tmpl.data.isHMISClient) {
        query.query = 'isHMISClient=true';
      }
      Router.go('adminDashboardclientsEdit', { _id: tmpl.data._id }, query);
    },
    'click .back': () => {
      Router.go('adminDashboardclientsView');
    },
    'click .add-to-hmis': (event, tmpl) => {
      Meteor.call(
        'addClientToHMIS', tmpl.data._id, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            let query = 'addClientToHMISError=1';
            let clientId = tmpl.data._id;
            if (result) {
              const params = {
                addedToHMIS: 1,
                isHMISClient: true,
                link: result.link,
                schema: 'v2015',
              };
              clientId = result._id;
              query = querystring.stringify(params);
            }

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
  }
);
