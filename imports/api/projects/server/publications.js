import { HmisClient } from '/imports/api/hmis-api';
// import { logger } from '/imports/utils/logger';

Meteor.publish('projects.list', function publishAllProjects() {
  if (!this.userId) {
    return;
  }
  const projects = HmisClient.create(this.userId).api('client').getProjects();
  projects.map(project => this.added('localProjects', project.projectId, project));
  this.ready();
});
