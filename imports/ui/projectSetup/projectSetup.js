import Projects from '/imports/api/projects/projects';
import './projectSetup.html';

Template.projectSetup.helpers({
  getProjects() {
    return Projects.find().fetch();
  },
});

Template.projectSetup.events(
  {
    'keyup #projectName': () => {
      const projectName = $('#projectName').val();
      $('#projectCommonName').val(projectName);
    },
    'click #createAppProject': () => {
      const projectName = $('#projectName').val();
      const projectCommonName = $('#projectCommonName').val();

      Meteor.call('createProjectSetup', projectName, projectCommonName);

      return false;
    },
    'submit #selectAppProjectFrm': (evt, tmpl) => {
      const projectId = tmpl.find('#existingProjects').value;

      let returnVal = false;
      if (projectId) {
        Meteor.call('selectProjectSetup', projectId, () => {
          location.reload();
        });
        returnVal = true;
      }

      return returnVal;
    },
    'click #removeAppProject': () => {
      Meteor.call('removeProjectSetup', () => {
        location.reload();
      });
    },
  }
);

Template.projectSetup.onRendered(() => {
  $('#existingProjects').select2({
    placeholder: 'Select a project',
    allowClear: true,
    theme: 'classic',
  });
});
