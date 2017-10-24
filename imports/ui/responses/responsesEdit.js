// import Responses from '/imports/api/responses/responses';
import Survey from '/imports/ui/components/surveyForm/Survey';
import { unescapeKeys } from '/imports/api/utils';
import './responsesEdit.html';

Template.responsesEdit.helpers({
  component() {
    return Survey;
  },
  definition() {
    return JSON.parse(this.survey.definition);
  },
  initialValues() {
    return unescapeKeys(this.response.values);
  },
  /*

    paused() {
      let flag = false;

      const responseRecord = Responses.findOne({ _id: Router.current().params._id });

      if (responseRecord && responseRecord.responsestatus) {
        const status = responseRecord.responsestatus;
        if (status === 'Paused') {
          // $('.savePaused_survey').show();
          // $('.pausePaused_survey').show();
          // $('.cancelPaused_survey').show();
          // $('#pauseSurvey').show();
          flag = true;
        }
      }

      return flag;
    },
  */
});

Template.responsesEdit.events({
  /*
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
            Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
          } else {
            Router.go('adminDashboardresponsesView');
          }
        });
      }
    },
    'click .cancel_survey': () => {
      Router.go('adminDashboardresponsesView');
    },
  */
});
