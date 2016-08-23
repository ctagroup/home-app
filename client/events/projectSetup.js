/**
 * Created by udit on 22/08/16.
 */

Template.projectSetup.events(
  {
    'keyup #projectName': () => {
      const projectName = $('#projectName').val();
      $('#projectCommonName').val(projectName);
    },
    'click #createAppProject': () => {
      const projectName = $('#projectName').val();
      const projectCommonName = $('#projectCommonName').val();

      Meteor.call('createProject', projectName, projectCommonName);

      return false;
    },
  }
);
