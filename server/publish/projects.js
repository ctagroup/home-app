/**
 * Created by udit on 22/08/16.
 */

Meteor.publish(
  'projects', function publishProjects() {
    const self = this;

    let projects = [];
    let appProjectId = '';

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);

      appProjectId = options.findOne({ option_name: 'appProjectId' });

      const response = HMISAPI.getProjectsForPublish();

      projects = response.projects;

      // starting from 1. because we already got the 0th page in previous call
      for (let i = 1; (i * 30) < response.pagination.total; i += 1) {
        const temp = HMISAPI.getProjectsForPublish(i * 30);
        projects.push(...temp.projects);
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }

    for (let i = 0; i < projects.length; i += 1) {
      if (appProjectId && projects[i].projectId === appProjectId.option_value) {
        projects[i].isAppProject = true;
      }
      self.added('projects', projects[i].projectId, projects[i]);
    }

    self.ready();
  }
);
