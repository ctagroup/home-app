import Surveys from '/imports/api/surveys/surveys';
import SurveyBuilder from '/imports/ui/components/surveyBuilder/SurveyBuilder.js';
import './surveyForm.html';

Template.surveyForm.helpers({
  component() {
    return SurveyBuilder;
  },

  doc() {
    return this.survey || {};
  },

  schema() {
    return Surveys.schema;
  },
});

/*
AutoForm.hooks({
  surveyForm: {
    onSubmit: function onSubmit(insertDoc, updateDoc, currentDoc) {
      if (currentDoc._id) {
        Meteor.call('surveys.update', currentDoc._id, updateDoc, (err) => {
          if (err) {
            Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Survey updated', 'success', 'growl-top-right');
          }
          this.done(err);
        });
      } else {
        Meteor.call('surveys.create', insertDoc, (err, res) => {
          if (err) {
            Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Survey created', 'success', 'growl-top-right');
            Router.go('surveysEdit', { _id: res });
          }
          this.done(err);
        });
      }
      return false;
    },
  },
});
*/
