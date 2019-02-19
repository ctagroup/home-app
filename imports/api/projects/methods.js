import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import AppSettings from '/imports/api/appSettings/appSettings';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Meteor.methods({
  'projects.create'(data) {
    logger.info(`METHOD[${this.userId}]: projects.create`, data);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('client').createProject(data);
  },

  'projects.update'(data, projectId, schema) {
    logger.info(`METHOD[${this.userId}]: projects.update`, data, projectId, schema);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('client').updateProject(projectId, data, schema);
  },

  'projects.delete'(projectId, schema) {
    logger.info(`METHOD[${this.userId}]: projects.delete`, projectId, schema);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('client').deleteProject(projectId, schema);
  },

  createProjectSetup(projectName, projectCommonName) {
    logger.info(`METHOD[${this.userId}]: createProjectSetup`, projectName);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const projectId = hc.api('client').createProjectSetup(projectName, projectCommonName);
    AppSettings.set('appProjectId', projectId);
    return projectId;
  },

  selectProjectSetup(projectId) {
    logger.info(`METHOD[${this.userId}]: selectProjectSetup`, projectId);
    check(projectId, String);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    AppSettings.set('appProjectId', projectId);
  },

  removeProjectSetup() {
    logger.info(`METHOD[${this.userId}]: removeProjectSetup`);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    AppSettings.remove('appProjectId');
  },
});
