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
      // do all the survey syncing here.
      const surveyDetails = surveys.findOne({ _id: surveyID });
      if (surveyDetails.apiSurveyServiceId) {
        // update survey online.
        hmisSurveySync.updateSurveyToHmis(surveyDetails, surveyID);
      } else {
        // add survey online.
        // create survey here.
        hmisSurveySync.addSurveyToHmis(surveyDetails, surveyID);
      }
      // end of Sync.
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
