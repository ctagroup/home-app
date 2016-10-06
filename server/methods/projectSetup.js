/**
 * Created by udit on 22/08/16.
 */

Meteor.methods(
  {
    createProjectSetup(projectName, projectCommonName) {
      const projectId = HMISAPI.createProjectSetup(projectName, projectCommonName);

      options.upsert(
        { option_name: 'appProjectId' }, {
          $set: {
            option_name: 'appProjectId',
            option_value: projectId,
          },
        }
      );
    },
    selectProjectSetup(projectId) {
      options.upsert(
        { option_name: 'appProjectId' }, {
          $set: {
            option_name: 'appProjectId',
            option_value: projectId,
          },
        }
      );
    },
    removeProjectSetup() {
      options.remove({ option_name: 'appProjectId' });
    },
  }
);
