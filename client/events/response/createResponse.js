/**
 * Created by udit on 02/08/16.
 */

Template.createResponse.events(
  {
    'click .pause_survey': (evt, tmpl) => {
      ResponseHelpers.saveResponse('Paused', tmpl);
    },
    'click .save_survey': (evt, tmpl) => {
      ResponseHelpers.saveResponse('Submit', tmpl);
    },
    'click .cancel_survey': (evt, tmpl) => {
      Router.go('selectSurvey', { _id: tmpl.data.client._id });
    },
  }
);
