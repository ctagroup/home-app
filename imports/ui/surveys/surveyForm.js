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
    return ['title', 'active', 'editable', 'definition'];
  },
});


AutoForm.hooks({
  surveyForm: {
    onSubmit: function onSubmit(insertDoc, updateDoc, currentDoc) {
      if (currentDoc._id) {
        Meteor.call('surveys.update', currentDoc._id, updateDoc, (err) => {
          if (err) {
            Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Survey updated', 'success', 'growl-top-right');
            Router.go('adminDashboardsurveysView');
          }
          this.done();
        });
      } else {
        Meteor.call('surveys.create', insertDoc, (err) => {
          if (err) {
            Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Survey created', 'success', 'growl-top-right');
            Router.go('adminDashboardsurveysView');
          }
          this.done();
        });
      }
      return false;
    },
  },
});
