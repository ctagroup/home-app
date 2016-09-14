/**
 * Created by udit on 22/08/16.
 */

Meteor.methods(
  {
    createProject(projectName, projectCommonName) {
      const projectId = HMISAPI.createProject(projectName, projectCommonName);

      options.upsert(
        { option_name: 'appProjectId' }, {
          $set: {
            option_name: 'appProjectId',
            option_value: projectId,
          },
        }
      );
    },
  }
);
