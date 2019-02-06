import yaml from 'js-yaml';
import Alert from '/imports/ui/alert';
import Surveys from '/imports/api/surveys/surveys';
import './surveyForm.html';

// hack to reload subscription on form submission
// survey publication is based on external api, not mongo
// so there is no document to change

Template.surveyForm.helpers({
  doc() {
    if (!this.survey) {
      return {};
    }
    try {
      const obj = JSON.parse(this.survey.definition);
      const definition = yaml.safeDump(obj);
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
      const jsonDefinition = JSON.stringify(yaml.safeLoad(insertDoc.definition));
      Object.assign(insertDoc, { definition: jsonDefinition });
      if (currentDoc._id) {
        Meteor.call('surveys.update', currentDoc._id, insertDoc, (err) => {
          if (err) {
            Alert.error(err);
          } else {
            Alert.success('Survey updated');
            // Router.go('adminDashboardsurveysView');
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
