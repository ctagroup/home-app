import { HmisClient } from '/imports/api/hmis-api';
// import { logger } from '/imports/utils/logger';

Meteor.publish('projects.list', function publishAllProjects() {
  if (!this.userId) {
    return;
  }
  const projects = HmisClient.create(this.userId).api('client').getProjects();
  const option = options.findOne({ option_name: 'appProjectId' }) || {};
  projects.map(project => {
    const data = _.extend(project, {
      isAppProject: project.projectId === option.option_value,
    });
    return this.added('localProjects', project.projectId, data);
  });
  this.ready();
});
