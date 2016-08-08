/**
 * Created by udit on 08/08/16.
 */

Template.editResponse.events(
  {
    'click .savePaused_survey': (evt, tmpl) => {
      ResponseHelpers.savePausedSurvey('Pause_Submit', tmpl);
    },
    'click .pausePaused_survey': (evt, tmpl) => {
      ResponseHelpers.savePausedSurvey('Pause_Paused', tmpl);
    },
    'click .cancel_survey': () => {
      Router.go('adminDashboardresponsesView');
    },
  }
);
