import AppSettings from '/imports/api/appSettings/appSettings';

Meteor.methods({
  createProjectSetup(projectName, projectCommonName) {
    const projectId = HMISAPI.createProjectSetup(projectName, projectCommonName);
    AppSettings.upsert('appProjectId', { value: projectId });
  },
  selectProjectSetup(projectId) {
    AppSettings.upsert('appProjectId', { value: projectId });
  },
  removeProjectSetup() {
    AppSettings.remove('appProjectId');
  },
});
