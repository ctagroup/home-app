import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import AppSettings from '/imports/api/appSettings/appSettings';


Meteor.publish('projects.all', function publishAllProjects() {
  logger.info(`PUB[${this.userId}]: projects.all`);
  if (!this.userId) {
    return [];
  }
  const projects = HmisClient.create(this.userId).api('client').getProjects();
  const appProjectId = AppSettings.get('appProjectId');

  projects.forEach(project => {
    const data = _.extend(project, {
      isAppProject: project.projectId === appProjectId,
    });
    return this.added('localProjects', project.projectId, data);
  });
  return this.ready();
});

Meteor.publish('projects.one', function publishOneProject(id) {
  logger.info(`PUB[${this.userId}]: projects.one`);
  if (!this.userId) {
    return [];
  }
  const project = HmisClient.create(this.userId).api('client').getProject(id);
  this.added('localProjects', project.projectId, project);
  return this.ready();
});
