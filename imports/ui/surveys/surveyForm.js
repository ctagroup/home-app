import Alert from '/imports/ui/alert';
import Surveys from '/imports/api/surveys/surveys';
import './surveyForm.html';

Template.surveyForm.helpers({
  doc() {
    if (!this.survey) {
      return {};
    }
    try {
      const obj = JSON.parse(this.survey.definition);
      const definition = JSON.stringify(obj, null, 2);
      return Object.assign(this.survey, { definition });
    } catch (e) {
      return this.survey;
    }
  },

  schema() {
    return Surveys.schema;
  },

  fields() {
    return ['title', 'locked', 'definition', 'hudSurvey', 'surveyVersion'];
  },
});


AutoForm.hooks({
  surveyForm: {
    onSubmit: function onSubmit(insertDoc, updateDoc, currentDoc) {
      if (currentDoc._id) {
        Meteor.call('surveys.update', currentDoc._id, insertDoc, (err) => {
          if (err) {
            Alert.error(err);
          } else {
            Alert.success('Survey updated');
            Router.go('adminDashboardsurveysView');
          }
          this.done();
        });
      } else {
        Meteor.call('surveys.create', insertDoc, (err) => {
          if (err) {
            Alert.error(err);
          } else {
            Alert.success('Survey created');
            Router.go('adminDashboardsurveysView');
          }
          this.done();
        });
      }
      return false;
    },
  },
});
