import { HmisClient } from '/imports/api/hmis-api';
import AppSettings from '/imports/api/appSettings/appSettings';

// import { logger } from '/imports/utils/logger';

Meteor.publish('projects.list', function publishAllProjects() {
  if (!this.userId) {
    return;
  }
  const projects = HmisClient.create(this.userId).api('client').getProjects();
  const appProjectId = AppSettings.get('appProjectId');

  projects.forEach(project => {
    const data = _.extend(project, {
      isAppProject: project.projectId === appProjectId,
    });
    return this.added('localProjects', project.projectId, data);
  });
  this.ready();
});
