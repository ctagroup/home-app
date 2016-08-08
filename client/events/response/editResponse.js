/**
 * Created by udit on 08/08/16.
 */

Template.editResponse.events(
  {
    'click .pause_survey': (evt, tmpl) => {
      ResponseHelpers.saveResponse('Paused', tmpl);
    },
    'click .save_survey': (evt, tmpl) => {
      ResponseHelpers.saveResponse('Submit', tmpl);
    },
    'click .cancel_survey': () => {
      Router.go('adminDashboardresponsesView');
    },
  }
);
