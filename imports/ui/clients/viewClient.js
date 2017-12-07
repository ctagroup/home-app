const querystring = require('querystring');
import { Clients } from '/imports/api/clients/clients';
import Users from '/imports/api/users/users';
import { RecentClients } from '/imports/api/recent-clients';
import Questions from '/imports/api/questions/questions';
import { logger } from '/imports/utils/logger';
import ReferralStatusList from './referralStatusList';
import HomeConfig from '/imports/config/homeConfig';

import './viewClient.html';

Template.viewClient.helpers(
  {
    clientResponsesPath() {
      const clientId = Router.current().params._id;
      const schema = Router.current().params.query.schema;
      const query = { clientId, schema };
      return Router.path('adminDashboardresponsesView', {}, { query });
    },
    isReferralStatusActive(step) {
      const client = Router.current().data().client;

      if (client.referralStatusHistory && client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        if (step <= lastStatus.status) {
          return 'active';
        }
      } else if (client.matchingScore && step <= 0) {
        return 'active';
      }
      return '';
    },
    isReferralStatusActiveButton(step) {
      const client = Router.current().data().client;

      if (client.referralStatusHistory && client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        if (step <= lastStatus.status) {
          return `btn-${ReferralStatusList[step].cssClass}`;
        }
      } else if (client.matchingScore && step <= 0) {
        return `btn-${ReferralStatusList[step].cssClass}`;
      }
      return 'btn-default';
    },
    getProgressbarActiveStatus() {
      const client = Router.current().data().client;
      if (client.referralStatusHistory && client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        const cssClass = ReferralStatusList[lastStatus.status].cssClass;
        return `progress-bar-${cssClass}`;
      } else if (client.matchingScore) {
        const cssClass = ReferralStatusList[0].cssClass;
        return `progress-bar-${cssClass}`;
      }
      return 'progress-bar-default';
    },
    getProgressbarWidth() {
      const client = Router.current().data().client;
      if (client.referralStatusHistory && client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        const total = ReferralStatusList.length;
        return `width: ${((lastStatus.status + 1) / total) * 100}%`;
      } else if (client.matchingScore) {
        const total = ReferralStatusList.length;
        return `width: ${(1 / total) * 100}%`;
      }
      return 'width: 0%;';
    },
    getCurrentReferralStatus() {
      const client = Router.current().data().client;
      if (client.referralStatusHistory && client.referralStatusHistory.length > 0) {
        const lastStatus = client.referralStatusHistory[client.referralStatusHistory.length - 1];
        return lastStatus.status + 1;
      } else if (client.matchingScore) {
        return 1;
      }
      return 0;
    },
    getReferralStatusList() {
      return ReferralStatusList;
    },
    getStatusTooltip(step) {
      const client = Router.current().data().client;
      let history = ReferralStatusList[step].desc;
      if (client.referralStatusHistory) {
        for (let i = 0; i < client.referralStatusHistory.length; i += 1) {
          if (client.referralStatusHistory[i].status === step) {
            let txt = client.referralStatusHistory[i].statusDescription;
            if (client.referralStatusHistory[i].comments) {
              txt = client.referralStatusHistory[i].comments;
            }
            history = `${history}<br />${client.referralStatusHistory[i].dateUpdated} - ${txt}`;
          }
        }
      }
      return history;
    },

    showEnrollments() {
      return Router.current().data().client.clientId && Router.current().params.query.schema;
    },

    showReferralStatus() {
      const hasPermission = Roles.userIsInRole(
        Meteor.user(), ['System Admin', 'Developer', 'Case Manager']
      );
      const isHmisClient = Router.current().data().client.clientId
        && Router.current().params.query.schema;
      return hasPermission && isHmisClient;
    },

    showGlobalHousehold() {
      return Roles.userIsInRole(
        Meteor.user(), ['System Admin', 'Developer', 'Case Manager', 'Surveyor']
      ) && Router.current().data().client.clientId && Router.current().params.query.schema;
    },

    getText(text, code) {
      let definition = code === undefined ? '?' : code;
      const question = Questions.findOne({ name: text });
      if (question && question.options) {
        for (let j = 0; j < question.options.length; j += 1) {
          if (parseInt(question.options[j].value, 10) === parseInt(code, 10)) {
            definition = question.options[j].description;
            break;
          }
        }
        return definition;
      }
      if (text === 'race') {
        switch (code) {
          case 1:
          case '1': return 'American Indian or Alaska Native';
          case 2:
          case '2': return 'Asian';
          case 3:
          case '3': return 'Black or African American';
          case 4:
          case '4': return 'Native Hawaiian or Other Pacific Islander';
          case 5:
          case '5': return 'White';
          default: return definition;
        }
      }
      if (text === 'ethnicity') {
        switch (code) {
          case 0:
          case '0': return 'Non-Hispanic/Non-Latino';
          case 1:
          case '1': return 'Hispanic/Latino';
          default: return definition;
        }
      }
      if (text === 'gender') {
        switch (code) {
          case 0:
          case '0': return 'Female';
          case 1:
          case '1': return 'Male';
          case 2:
          case '2': return 'Transgender male to female';
          case 3:
          case '3': return 'Transgender female to male';
          case 4:
          case '4': return 'Other';
          default: return definition;
        }
      }
      if (text === 'veteranStatus' || text === 'disablingcondition') {
        switch (code) {
          case 0:
          case '0': return 'No';
          case 1:
          case '1': return 'Yes';
          default: return definition;
        }
      }
      return definition;
    },
  }
);

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
      Meteor.call('uploadPendingClientToHmis', client._id, (error, result) => {
        if (error) {
          Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
        } else {
          RecentClients.remove(client._id);
          Bert.alert('Client uploaded to HMIS', 'success', 'growl-top-right');
          const query = querystring.stringify({ schema: result.schema });
          Router.go('viewClient', { _id: result.hmisClientId }, { query });
        }
      });
    },
    'click .takeSurvey': (event, tmpl) => {
      const query = {};

      if (Router.current().params.query.schema) {
        query.query = {
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
      const total = ReferralStatusList.length;
      const percent = ((index + 1) / total) * 100;

      const cssClass = ReferralStatusList[index].cssClass;

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
          const linkedUsers = Users.find({ projectsLinked: project.projectId }).fetch();
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

Template.viewClient.onRendered(() => {
  $('body').addClass('sidebar-collapse');

  if (Roles.userIsInRole(Meteor.user(), ['Developer', 'System Admin'])) {
    $('a[data-toggle="tab"]').on('shown.bs.tab', (/* e */) => { });

    $('.js-summernote').summernote({
      minHeight: 100,
      fontNames: HomeConfig.fontFamilies,
    });
  }
});

Template.viewClient.onDestroyed(() => {
  $('body').removeClass('sidebar-collapse');
});
