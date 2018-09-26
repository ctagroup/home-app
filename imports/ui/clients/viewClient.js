import { ReactiveVar } from 'meteor/reactive-var';
import { Clients } from '/imports/api/clients/clients';
import Users from '/imports/api/users/users';
import { RecentClients } from '/imports/api/recent-clients';
import Questions from '/imports/api/questions/questions';
import Agencies from '/imports/api/agencies/agencies';
import Projects from '/imports/api/projects/projects';
import { logger } from '/imports/utils/logger';
import ReferralStatusList from './referralStatusList';
import HomeConfig from '/imports/config/homeConfig';
import { FilesAccessRoles, HouseholdAccessRoles } from '/imports/config/permissions';

import { getRace, getGender, getEthnicity, getYesNo } from './textHelpers.js';

import './clientDeleteReason.js';
import './manageClientEnrollments.html';
import './viewClient.html';
import '../enrollments/enrollmentsNew';
import '../enrollments/dropdownHelper.js';

const flattenKeyVersions = (client, key) => {
  const keyVersions = client.clientVersions
    .map(({ clientId, schema }) => client[`${key}::${schema}::${clientId}`])
    .filter((value) => !!value);
  const mongoKey = client[key] || [];
  return _.flatten([keyVersions, mongoKey]);
};
const getLastStatus = (statusHistory) => statusHistory && statusHistory[statusHistory.length - 1];

const updateEligibility = (client) => {
  const currentClientId = client.clientId;
  // drop not found:
  const clientVersions = client.clientVersions
    .filter(({ clientId, schema }) => {
      const data = client[`eligibleClient::${schema}::${clientId}`];
      return data && !data.error;
    });
  const ignored = clientVersions.find(({ clientId, schema }) => {
    const data = client[`eligibleClient::${schema}::${clientId}`];
    return data.ignoreMatchProcess;
  });
  const updateRequired = clientVersions.filter(({ clientId, schema }) => {
    const data = client[`eligibleClient::${schema}::${clientId}`];
    return (!data.updating) && !data.ignoreMatchProcess;
  });
  if (ignored && updateRequired.length) {
    const remarks = client[`eligibleClient::${ignored.schema}::${ignored.clientId}`].remarks;
    const clientIds = updateRequired.map(({ clientId }) => clientId);
    // mark updating client versions:
    const updating = updateRequired.reduce((acc, { clientId, schema }) =>
      ({ ...acc, [`eligibleClient::${schema}::${clientId}.updating`]: true }), {});
    Clients._collection.update(currentClientId, { $set: updating});  // eslint-disable-line
    Meteor.call('ignoreMatchProcess', clientIds, true, remarks, (err) => {
      if (!err) {
        const changes = updateRequired.reduce((acc, { clientId, schema }) => ({
          ...acc,
          [`eligibleClient::${schema}::${clientId}.ignoreMatchProcess`]: true,
          [`eligibleClient::${schema}::${clientId}.remarks`]: remarks,
          [`eligibleClient::${schema}::${clientId}.updating`]: false,
        }), {});
        Clients._collection.update(currentClientId, { $set: changes});  // eslint-disable-line
      }
    });
  }
};

Template.viewClient.helpers(
  {
    currentClient() {
      return this;
    },
    enrollmentInfo() {
      const projectId = Template.instance().selectedProject.get();
      if (!projectId) return {};
      // const project = Projects.findOne(selectedProjectId);
      // get agency
      // get enrollmentSurveys
      // get enr id

      return {
        projectId,
        // enrollmentId: project,
      };
    },
    selectedProjectStore() {
      return Template.instance().selectedProject;
    },
    selectedProjectId() {
      return Template.instance().selectedProject.get();
    },
    selectedProject() {
      const selectedProjectId = Template.instance().selectedProject.get();
      return Projects.findOne(selectedProjectId);
    },
    projectEntrySurveyId() {
      const projectId = Template.instance().selectedProject.get();
      if (projectId) {
        const agencies = Agencies.find().fetch();
        const selectedAgency =
          agencies.find((agency) => agency.getProjectSurveyId(projectId, 'entry'));
        return selectedAgency && selectedAgency.getProjectSurveyId(projectId, 'entry');
      }
      return false;
    },
    projects() {
      const allProjects = Agencies.find().fetch()
      .reduce((all, agency) => {
        const projectsIds = agency.projectsOfUser(Meteor.userId());
        const agencyProjects = projectsIds.map(projectId => ({
          agency,
          project: Projects.findOne(projectId) || { _id: projectId },
        }));
        return [...all, ...agencyProjects];
      }, []);

      return allProjects.map(({ agency, project }) => ({
        id: project._id,
        label: `${agency.agencyName}/${project.projectName || project._id}`,
      }));
    },
    eligibleClient() {
      // TODO [VK]: check by updated at instead of schema version
      const currentClientId = Router.current().params._id;
      const client = Clients.findOne(currentClientId);
      if (!client) return null;
      const versions = flattenKeyVersions(client, 'eligibleClient');
      const nonError = versions.filter(({ error }) => !error);
      if (nonError.length) {
        updateEligibility(client);
        return nonError[nonError.length - 1];
      }
      return versions[versions.length - 1];
    },
    enrollments() {
      const currentClientId = Router.current().params._id;
      const client = Clients.findOne(currentClientId);
      return flattenKeyVersions(client, 'enrollments');
    },
    globalHouseholds() {
      const currentClientId = Router.current().params._id;
      const client = Clients.findOne(currentClientId);
      return flattenKeyVersions(client, 'globalHouseholds');
    },
    isActive(tab) {
      if (Template.instance() && Template.instance().selectedTab) {
        const selectedTab = Template.instance().selectedTab.get();
        return selectedTab.slice(6) === tab;
      }
      return false;
    },
    clientResponsesPath() {
      const clientId = Router.current().params._id;
      const schema = Router.current().params.query.schema;
      const query = { clientId, schema };
      return Router.path('adminDashboardresponsesView', {}, { query });
    },
    isReferralStatusActive(step) {
      const client = Router.current().data().client;
      const lastStatus = getLastStatus(client.referralStatusHistory);
      if (lastStatus) {
        if (step <= lastStatus.status) return 'active';
      } else if (client.matchingScore && step <= 0) {
        return 'active';
      }
      return '';
    },
    isReferralStatusActiveButton(step) {
      const client = Router.current().data().client;
      const lastStatus = getLastStatus(client.referralStatusHistory);
      if (lastStatus) {
        if (step <= lastStatus.status) return `btn-${ReferralStatusList[step].cssClass}`;
      } else if (client.matchingScore && step <= 0) {
        return `btn-${ReferralStatusList[step].cssClass}`;
      }
      return 'btn-default';
    },
    getProgressbarActiveStatus() {
      const client = Router.current().data().client;
      const lastStatus = getLastStatus(client.referralStatusHistory);
      let cssClass = 'default';
      if (lastStatus) {
        cssClass = ReferralStatusList[lastStatus.status].cssClass;
      } else if (client.matchingScore) {
        cssClass = ReferralStatusList[0].cssClass;
      }
      return `progress-bar-${cssClass}`;
    },
    getProgressbarWidth() {
      const client = Router.current().data().client;
      const total = ReferralStatusList.length;
      const lastStatus = getLastStatus(client.referralStatusHistory);
      let status = -1;
      if (lastStatus) {
        status = lastStatus.status;
      } else if (client.matchingScore) {
        status = 0;
      }
      return `width: ${((status + 1) / total) * 100}%;`;
    },
    getCurrentReferralStatus() {
      const client = Router.current().data().client;
      const lastStatus = getLastStatus(client.referralStatusHistory);
      if (lastStatus) return lastStatus.status + 1;
      if (client.matchingScore) return 1;
      return 0;
    },
    getReferralStatusList() {
      return ReferralStatusList;
    },
    getStatusTooltip(step) {
      const client = Router.current().data().client;
      let history = ReferralStatusList[step].desc;
      (client.referralStatusHistory || []).forEach((item) => {
        if (item.status === step) {
          const txt = item.statusDescription || item.comments;
          history = `${history}<br />${item.dateUpdated} - ${txt}`;
        }
      });
      return history;
    },

    showEnrollments() {
      // const schema = Router.current().params.query.schema;
      return (this && this.clientId);
    },

    showReferralStatus() {
      const hasPermission = Roles.userIsInRole(Meteor.userId(), FilesAccessRoles);
      // const isHmisClient = Router.current().data().client.clientId
      //   && Router.current().params.query.schema;
      return hasPermission && this && this.clientId;
    },

    showGlobalHousehold() {
      const hasPermission = Roles.userIsInRole(Meteor.userId(), HouseholdAccessRoles);
      return hasPermission && this && this.clientId;
    },

    getText(text, code) {
      const definition = code === undefined ? '?' : code;
      const question = Questions.findOne({ name: text });
      const intCode = parseInt(code, 10);
      if (question && question.options) {
        const foundQuestion = question.options.find(
          (option) => parseInt(option.value, 10) === intCode);
        return foundQuestion ? foundQuestion.description : definition;
      }
      switch (text) {
        case 'race': return getRace(intCode, definition);
        case 'ethnicity': return getEthnicity(intCode, definition);
        case 'gender': return getGender(intCode, definition);
        case 'veteranStatus':
        case 'disablingcondition': return getYesNo(intCode, definition);
        default: return definition;
      }
    },
  }
);

Template.viewClient.events(
  {
    // 'click .updateLink': (evt) => {
    //   evt.preventDefault();
    //   const enrollmentId = evt.target.id.slice(2);

    // },
    // 'click .exitLink': (evt) => {
    //   evt.preventDefault();
    //   const enrollmentId = evt.target.id.slice(2);
    // },
    'click .nav-link': (evt, tmpl) => {
      const tab = evt.target.hash.slice(1);
      tmpl.selectedTab.set(tab);
    },
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
          Router.go('viewClient', { _id: result.clientId }, { query: { schema: result.schema } });
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
    },

    'click .addToHousingList'(evt, tmpl) {
      const client = tmpl.data.client;
      const currentClientId = tmpl.data.client._id;
      // drop not found:
      const clientVersions = client.clientVersions
        .filter(({ clientId, schema }) => {
          const data = client[`eligibleClient::${schema}::${clientId}`];
          return data && !data.error;
        });
      const clientIds = clientVersions.map(({ clientId }) => clientId);
      // Optimistic UI approach:
      const changes = clientVersions.reduce((acc, { clientId, schema }) => ({
        ...acc,
        [`eligibleClient::${schema}::${clientId}.ignoreMatchProcess`]: false,
        [`eligibleClient::${schema}::${clientId}.remarks`]: 'Restored to active list by user',
      }), {});

      Meteor.call('ignoreMatchProcess', clientIds, false, (err /* , res*/) => {
        if (err) {
          Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Client added to the matching process', 'success', 'growl-top-right');
          // We simulate update in client-side collection
          // Sadly, this cannot be done in meteor call (isSimulation)
          Clients._collection.update(currentClientId, { $set: changes }); // eslint-disable-line
        }
      });
    },
  }
);

Template.viewClient.onCreated(function onCreated() {
  this.selectedTab = new ReactiveVar('panel-overview');
  this.selectedProject = new ReactiveVar(false);
});

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
