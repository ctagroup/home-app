/**
 * Created by udit on 22/08/16.
 */

Meteor.publish(
  'projectSetup', function publishProjectSetup() {
    const self = this;

    let project = undefined;

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);

      const projectId = options.findOne({ option_name: 'appProjectId' });

      if (projectId) {
        project = HMISAPI.getProject(projectId.option_value);
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }

    if (project) {
      self.added('projectSetup', project.projectId, project);
    }

    self.ready();
  }
);
