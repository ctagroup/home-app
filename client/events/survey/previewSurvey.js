/**
 * Created by udit on 04/08/16.
 */

Template.previewSurvey.events(
  {
    'click .createSurvey'(evt /* , tmpl*/) {
      evt.preventDefault();
      $('#confirmationModal').modal('show');
    },
    'click .save_survey'(evt, tmpl) {
      // alert("save clicked: " + tmpl.data._id );
      const surveyID = tmpl.data._id;
      const created = true;

      Meteor.call(
        'updateCreatedSurvey', surveyID, created, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );
    },
  }
);
