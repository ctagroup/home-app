import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import AppSettings from '/imports/api/appSettings/appSettings';


Meteor.methods({
  'projects.create'(data) {
    logger.info(`METHOD[${this.userId}]: projects.create`, data);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('client').createProject(data);
  },
  'projects.update'(data, projectId, schema) {
    logger.info(`METHOD[${this.userId}]: projects.update`, data, projectId, schema);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('client').updateProject(projectId, data, schema);
  },
  createProjectSetup(projectName, projectCommonName) {
    logger.info(`METHOD[${Meteor.userId()}]: createProjectSetup`, projectName);
    const hc = HmisClient.create(Meteor.userId());
    const projectId = hc.api('client').createProjectSetup(projectName, projectCommonName);
    AppSettings.set('appProjectId', projectId);
    return projectId;
  },
  selectProjectSetup(projectId) {
    logger.info(`METHOD[${Meteor.userId()}]: selectProjectSetup`, projectId);
    AppSettings.set('appProjectId', projectId);
  },
  removeProjectSetup() {
    logger.info(`METHOD[${Meteor.userId()}]: removeProjectSetup`);
    AppSettings.remove('appProjectId');
  },
});
