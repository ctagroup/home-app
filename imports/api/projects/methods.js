import AppSettings from '/imports/api/appSettings/appSettings';

Meteor.methods({
  createProjectSetup(projectName, projectCommonName) {
    const projectId = HMISAPI.createProjectSetup(projectName, projectCommonName);
    AppSettings.set('appProjectId', projectId);
  },
  selectProjectSetup(projectId) {
    AppSettings.set('appProjectId', projectId);
  },
  removeProjectSetup() {
    AppSettings.remove('appProjectId');
  },
});
