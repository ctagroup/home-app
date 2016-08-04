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
  }
);
