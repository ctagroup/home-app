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
    'click .removePaused_survey': (evt, tmpl) => {
      if (confirm('Are you sure you want to remove this response?') === true) {
        ResponseHelpers.removePausedSurvey(tmpl, (err) => {
          if (err) {
            alert(err);
          } else {
            Router.go('adminDashboardresponsesView');
          }
        });
      }
    },
    'click .cancel_survey': () => {
      Router.go('adminDashboardresponsesView');
    },
  }
);
