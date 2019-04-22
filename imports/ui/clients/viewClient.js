import moment from 'moment';
import { ReactiveVar } from 'meteor/reactive-var';
import { Clients } from '/imports/api/clients/clients';
import Users from '/imports/api/users/users';
import { RecentClients } from '/imports/api/recent-clients';
import Questions from '/imports/api/questions/questions';
import Agencies from '/imports/api/agencies/agencies';
import Projects from '/imports/api/projects/projects';
import Responses from '/imports/api/responses/responses';
import Services from '/imports/api/services/services';
import { ClientTags } from '/imports/api/tags/clientTags.js';
import { logger } from '/imports/utils/logger';
import ReferralStatusList from './referralStatusList';
import HomeConfig from '/imports/config/homeConfig';
import Alert from '/imports/ui/alert';
import { TableDom } from '/imports/ui/dataTable/helpers';

import FeatureDecisions from '/imports/both/featureDecisions';
import ClientContainer from '/imports/ui/components/client/ClientContainer';

import { FilesAccessRoles, GlobalHouseholdsAccessRoles } from '/imports/config/permissions';

import { getRace, getGender, getEthnicity, getYesNo } from './textHelpers.js';
import { getActiveTagNamesForDate } from '/imports/api/tags/tags';
import { dataCollectionStages } from '/imports/both/helpers';

import './enrollmentsListView.js';
import './clientDeleteReason.js';
import './clientTagList.js';
import './manageClientEnrollments.html';
import './panelRois.js';
import '../enrollments/enrollmentsNew';
import '../enrollments/enrollmentsUpdate';
import '../enrollments/dropdownHelper.js';
import './viewClient.html';

const changeQueryWithParam = (query, param, add, value) => {
  if (query === '') return `?${param}=${value}`;
  const paramsString = query.startsWith('?') ? query.slice(1) : query;
  const searchParams = new URLSearchParams(paramsString);
  if (add) { searchParams.set(param, value); } else { searchParams.delete(param); }
  return `?${searchParams.toString()}`;
};

const extendQueryWithParam = (query, param, value) =>
  changeQueryWithParam(query, param, true, value);
const removeQueryFromParam = (query, param) => changeQueryWithParam(query, param, false);
const pushToURI = (name, url) => history.replaceState(history.state, name, url);

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
  // const getEligibleClientKey = (clientId, schema) => `eligibleClient::${schema}::${clientId}`;
  const getEligibleClient = (clientId, schema) => client[`eligibleClient::${schema}::${clientId}`];
  // drop not found:
  const clientVersions = client.clientVersions
    .filter(({ clientId, schema }) => {
      const data = getEligibleClient(clientId, schema);
      return data && !data.error;
    });
  const ignored = clientVersions.find(({ clientId, schema }) => {
    const data = getEligibleClient(clientId, schema);
    return data.ignoreMatchProcess;
  });
  const updateRequired = clientVersions.filter(({ clientId, schema }) => {
    const data = getEligibleClient(clientId, schema);
    return (!data.updating) && !data.ignoreMatchProcess;
  });
  if (ignored && updateRequired.length) {
    const remarks = getEligibleClient(ignored.clientId, ignored.schema).remarks;
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

function getEnrollmentSurveyIdForProject(projectId, surveyType) {
  if (projectId) {
    const agencies = Agencies.find().fetch();
    const selectedAgency =
      agencies.find((agency) => agency.getProjectSurveyId(projectId, surveyType));
    return selectedAgency && selectedAgency.getProjectSurveyId(projectId, surveyType);
  }
  return false;
}

const serviceTableOptions = {
  columns: [
    {
      title: 'Project Name',
      data: 'projectId',
      render(value) {
        return Projects.findOne(value).projectName;
      },
    },
    {
      title: 'Service Name',
      data: 'serviceName',
    },
    {
      title: 'Service Qty',
      data: 'qty',
    },
    {
      title: 'Cost Currency',
      data: 'costCurrency',
    },
    {
      title: 'Description',
      data: 'description',
    },
  ],
  dom: TableDom,
};

Template.viewClient.helpers(
  {
    component() {
      return ClientContainer;
    },

    permissions() {
      const hasPermission = Roles.userIsInRole(Meteor.userId(), FilesAccessRoles);

      const showEnrollments = this && this.clientId;

      const getEnrollmentType = (stage) => {
        const enrollmentId = Template.instance().selectedEnrollment.get();
        const dataCollectionStage = Template.instance().dataCollectionStage.get();
        return dataCollectionStage / 1 === dataCollectionStages[stage] && enrollmentId;
      };
      return {
        showReferralStatus: hasPermission && this && this.clientId,
        showEnrollments,
        updateEnrollment: getEnrollmentType('UPDATE'),
        annualEnrollment: getEnrollmentType('ANNUAL'),
        exitEnrollment: getEnrollmentType('EXIT'),
        showEditButton: Template.instance() && Template.instance().data.showEditButton,
        isSkidrowApp: FeatureDecisions.createFromMeteorSettings().isSkidrowApp(),
      };
    },
    data() {
      return {
        enrollments() {
          const currentClientId = Router.current().params._id;
          const client = Clients.findOne(currentClientId);
          const enrollments = flattenKeyVersions(client, 'enrollments')
            .sort((a, b) => {
              if (a.entryDate === b.entryDate) return a.dateUpdated - b.dateUpdated;
              return a.entryDate - b.entryDate;
            });
          return enrollments;
        },
      };
    },
    helpers() {
      return {
        enrollments: {
          viewEnrollmentPath(enrollment, enrollmentSurveyType) {
            const { _id } = Router.current().params;
            const { schema } = Router.current().params.query;
            const { enrollmentId } = enrollment;
            const projectId = Meteor.user().activeProjectId;
            const surveyId = getEnrollmentSurveyIdForProject(projectId, enrollmentSurveyType);

            const enrollmentSurveyTypeMap = {
              entry: dataCollectionStages.ENTRY,
              update: dataCollectionStages.UPDATE,
              exit: dataCollectionStages.EXIT,
            };
            const dataCollectionStage = enrollmentSurveyTypeMap[enrollmentSurveyType];

            return Router.path('viewEnrollmentAsResponse',
              { _id, enrollmentId },
              { query: { schema, surveyId, dataCollectionStage } }
            );
          },
          currentProjectHasEnrollment(enrollmentSurveyType) {
            const projectId = Meteor.user().activeProjectId;
            const surveyId = getEnrollmentSurveyIdForProject(projectId, enrollmentSurveyType);
            return !!surveyId;
          },
          enrollmentResponses(enrollmentId, dataCollectionStage) {
            const options = { 'enrollmentInfo.dataCollectionStage': dataCollectionStage };
            const optionKey = dataCollectionStage === dataCollectionStages.ENTRY ?
            'enrollment.enrollment-0.id' : 'enrollmentInfo.enrollmentId';
            options[optionKey] = enrollmentId;
            return Responses.find(options).fetch();
          },
          enrollmentExited(enrollmentId) {
            return Responses.find({
              'enrollmentInfo.enrollmentId': enrollmentId,
              'enrollmentInfo.dataCollectionStage': dataCollectionStages.EXIT,
            }).count() >= 1;
          },
        },
      };
    },
    selectedTab() {
      if (Template.instance() && Template.instance().selectedTab) {
        const selectedTab = Template.instance().selectedTab.get();
        return selectedTab.slice(6);
      }
      return 'false';
    },

    clientTagNames() {
      const clientTags = ClientTags.find().fetch();
      const now = moment().format('YYYY-MM-DD');
      const activeTags = getActiveTagNamesForDate(clientTags, now);
      return activeTags.join(', ');
    },
    formatSSN(ssn) {
      if (!ssn) return '';
      // XXX-XX-3210
      return `XXX-XX${ssn.slice(6)}`;
    },
    dataCollectionStages() {
      return dataCollectionStages;
    },
    updateEnrollment() {
      const enrollmentId = Template.instance().selectedEnrollment.get();
      const dataCollectionStage = Template.instance().dataCollectionStage.get();
      return dataCollectionStage / 1 === dataCollectionStages.UPDATE && enrollmentId;
    },
    annualEnrollment() {
      const enrollmentId = Template.instance().selectedEnrollment.get();
      const dataCollectionStage = Template.instance().dataCollectionStage.get();
      return dataCollectionStage / 1 === dataCollectionStages.ANNUAL && enrollmentId;
    },
    exitEnrollment() {
      const enrollmentId = Template.instance().selectedEnrollment.get();
      const dataCollectionStage = Template.instance().dataCollectionStage.get();
      return dataCollectionStage / 1 === dataCollectionStages.EXIT && enrollmentId;
    },
    currentClient() {
      return Template.instance().data.client;
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
        dataCollectionStage: parseInt(Router.current().params.query.dataCollectionStage, 10),
      };
    },
    updateEnrollmentInfo() {
      const selectedEnrollmentId = Template.instance().selectedEnrollment.get();
      const currentClientId = Router.current().params._id;
      const client = Clients.findOne(currentClientId);
      const enrollments = flattenKeyVersions(client, 'enrollments');
      const enrollment =
        enrollments.find(({ enrollmentId }) => enrollmentId === selectedEnrollmentId);
      const projectId = enrollment && enrollment.projectId;
      return {
        projectId,
        dataCollectionStage: Router.current().params.query.dataCollectionStage,
        enrollmentId: Router.current().params.query.enrollmentId,
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
      const selectedProjectId = Template.instance().selectedProject.get();
      return getEnrollmentSurveyIdForProject(selectedProjectId, 'entry');
    },
    projectUpdateSurveyId() {
      const selectedEnrollmentId = Template.instance().selectedEnrollment.get();
      const currentClientId = Router.current().params._id;
      const client = Clients.findOne(currentClientId);
      const enrollments = flattenKeyVersions(client, 'enrollments');
      const enrollment =
        enrollments.find(({ enrollmentId }) => enrollmentId === selectedEnrollmentId);

      const projectId = enrollment && enrollment.projectId;
      if (projectId) {
        const agencies = Agencies.find().fetch();
        const selectedAgency =
          agencies.find((agency) => agency.getProjectSurveyId(projectId, 'update'));
        return selectedAgency && selectedAgency.getProjectSurveyId(projectId, 'update');
      }
      return false;
    },
    updateEnrollmentProjectId() {
      const selectedEnrollmentId = Template.instance().selectedEnrollment.get();
      const currentClientId = Router.current().params._id;
      const client = Clients.findOne(currentClientId);
      const enrollments = flattenKeyVersions(client, 'enrollments');
      const enrollment =
        enrollments.find(({ enrollmentId }) => enrollmentId === selectedEnrollmentId);

      return enrollment && enrollment.projectId;
    },
    updateEnrollmentProject() {
      const selectedEnrollmentId = Template.instance().selectedEnrollment.get();
      const currentClientId = Router.current().params._id;
      const client = Clients.findOne(currentClientId);
      const enrollments = flattenKeyVersions(client, 'enrollments');
      const enrollment =
        enrollments.find(({ enrollmentId }) => enrollmentId === selectedEnrollmentId);

      const projectId = enrollment && enrollment.projectId;
      return Projects.findOne(projectId);
    },
    projects() {
      const allProjects = Agencies.find().fetch()
      .reduce((all, agency) => {
        if (agency.enrollmentSurveys) {
          const projectsIds = agency.projectsOfUser(Meteor.userId());
          const agencyProjects = projectsIds.map(projectId => {
            // Getting only agencies with surveys:
            if (agency.getProjectSurveyId(projectId, 'entry')) {
              return {
                agency,
                project: Projects.findOne(projectId) || { _id: projectId },
              };
            }
            return null;
          }).filter(i => i);
          return [...all, ...agencyProjects];
        }
        return all;
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
      const enrollments = flattenKeyVersions(client, 'enrollments');

      return enrollments
      // .filter(withResponse)
      .sort((a, b) => {
        if (a.entryDate === b.entryDate) return a.dateUpdated - b.dateUpdated;
        return a.entryDate - b.entryDate;
      });
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
    currentProjectHasEnrollment(enrollmentSurveyType) {
      const projectId = Meteor.user().activeProjectId;
      const surveyId = getEnrollmentSurveyIdForProject(projectId, enrollmentSurveyType);
      return !!surveyId;
    },
    viewEnrollmentPath(enrollment, enrollmentSurveyType) {
      const { _id } = Router.current().params;
      const { schema } = Router.current().params.query;
      const { enrollmentId } = enrollment;
      const projectId = Meteor.user().activeProjectId;
      const surveyId = getEnrollmentSurveyIdForProject(projectId, enrollmentSurveyType);

      const enrollmentSurveyTypeMap = {
        entry: dataCollectionStages.ENTRY,
        update: dataCollectionStages.UPDATE,
        exit: dataCollectionStages.EXIT,
      };
      const dataCollectionStage = enrollmentSurveyTypeMap[enrollmentSurveyType];

      return Router.path('viewEnrollmentAsResponse',
        { _id, enrollmentId },
        { query: { schema, surveyId, dataCollectionStage } }
      );
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
      const hasPermission = Roles.userIsInRole(Meteor.userId(), GlobalHouseholdsAccessRoles);
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

    enrollmentResponses(enrollmentId, dataCollectionStage) {
      const options = { 'enrollmentInfo.dataCollectionStage': dataCollectionStage };
      const optionKey = dataCollectionStage === dataCollectionStages.ENTRY ?
      'enrollment.enrollment-0.id' : 'enrollmentInfo.enrollmentId';
      options[optionKey] = enrollmentId;
      return Responses.find(options).fetch();
    },
    enrollmentExited(enrollmentId) {
      return Responses.find({
        'enrollmentInfo.enrollmentId': enrollmentId,
        'enrollmentInfo.dataCollectionStage': dataCollectionStages.EXIT,
      }).count() >= 1;
    },
    serviceHasData() {
      return Services.find().count() > 0;
    },
    ProjectsAll() {
      console.log('pp', Projects.find().fetch());
      return Projects.find().fetch();
    },
    serviceTableOptions() {
      return serviceTableOptions;
    },
    serviceTableData() {
      console.log('xxx', Services.find().fetch());
      return Services.find().fetch();
    },

  }
);

// TODO: merge update end exit workflows:
Template.viewClient.events(
  {
    'click .updateLink': (evt, tmpl) => {
      evt.preventDefault();
      let dataCollectionStage;
      let tab;
      switch (evt.target.id[0]) {
        case 'u':
          dataCollectionStage = dataCollectionStages.UPDATE;
          tab = 'panel-update-enrollment';
          break;
        case 'e':
          dataCollectionStage = dataCollectionStages.EXIT;
          tab = 'panel-exit-enrollment';
          break;
        case 'a':
          dataCollectionStage = dataCollectionStages.ANNUAL;
          tab = 'panel-annual-enrollment';
          break;
        default:
          return;
      }
      const enrollmentId = evt.target.id.slice(2);
      tmpl.dataCollectionStage.set(dataCollectionStage);
      tmpl.selectedEnrollment.set(enrollmentId);
      const { _id } = Router.current().params;
      const query1 = extendQueryWithParam(window.location.search, 'selectedTab', tab);
      const query2 = extendQueryWithParam(query1, 'enrollmentId', enrollmentId);
      const newLocation = extendQueryWithParam(query2, 'dataCollectionStage', dataCollectionStage);
      pushToURI(tab, _id + newLocation);
      Router.current().params.query.dataCollectionStage = dataCollectionStage;
      Router.current().params.query.enrollmentId = enrollmentId;
      Router.current().params.query.selectedTab = tab;
      tmpl.selectedTab.set(tab);
    },
    'click .nav-link': (evt, tmpl) => {
      const tab = evt.target.hash.slice(1);
      tmpl.selectedTab.set(tab);
      const { _id } = Router.current().params;
      // const { _id, query, hash } = Router.current().params;
      tmpl.selectedEnrollment.set(false); // Remove selectedEnrollment
      let newLocation = '';
      switch (tab) {
        case 'panel-create-enrollment': {
          Router.current().params.query.dataCollectionStage = dataCollectionStages.ENTRY;
          newLocation = extendQueryWithParam(
            extendQueryWithParam(window.location.search, 'selectedTab', tab),
            'dataCollectionStage', dataCollectionStages.ENTRY);
          break;
        }
        default: {
          newLocation = removeQueryFromParam(
            extendQueryWithParam(window.location.search, 'selectedTab', tab),
            'dataCollectionStage');
        }
      }
      // !NB: Push to history and Router.current().params to skip page reload;
      pushToURI(tab, _id + newLocation);
      Router.current().params.query.selectedTab = tab;
      // Router.go(Router.current().route.getName(), { _id }, { query, hash });
    },
    'click .edit': (evt, tmpl) => {
      const query = {};
      const client = tmpl.data.client;
      if (client.schema) query.query = `schema=${client.schema}`;
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
    'click .service_submit': (event, tmpl) => {
      event.preventDefault();

      const client = tmpl.data.client;
      const clientId = client._id;
      const data = {
        clientId,
        clientSchema: client.schema,
        dedupClientId: client.dedupClientId,
        projectId: tmpl.find('.service_project').value,
        serviceName: tmpl.find('.service_type').value,
        serviceDate: tmpl.find('.serviceDate').value,
        qty: tmpl.find('.serviceQty').value,
        costCurrency: tmpl.find('.servicecostcurrency').value,
        description: tmpl.find('.serviceDescription').value,
      };

      Meteor.call('services.create', data, (error) => {
        if (error) {
          Alert.error(error);
        } else {
          Alert.success('Service created');
          $(event.target).closest('form')
            .find('input[type=text],select,textarea')
            .val('');
        }
      });
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
       'clients.updateMatchStatus',
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
  let tab = Router.current().params.query.selectedTab || 'panel-overview';
  // update tab not available on page load:
  tab = tab === 'panel-update-enrollment' ? 'panel-overview' : tab;
  this.selectedTab = new ReactiveVar(tab);
  this.selectedProject = new ReactiveVar(false);
  this.selectedEnrollment = new ReactiveVar(false);
  this.dataCollectionStage = new ReactiveVar(0);
  this.autorun(() => {
    const enrollmentIds = flattenKeyVersions(this.data.client, 'enrollments')
      .map(e => e.enrollmentId);
    Meteor.subscribe('responses.enrollments', enrollmentIds);
  });
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
