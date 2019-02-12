import './dropdownHelper.js';
import './selectEnrollmentSurveys.html';
import Surveys from '../../api/surveys/surveys.js';
import { ReactiveVar } from 'meteor/reactive-var';

/**
 * View to select Enrollment Surveys for a project
 */
Template.selectEnrollmentSurveys.onCreated(function selectSurveysCreated() {
  this.selectedSchema = new ReactiveVar(false);
});

Template.selectEnrollmentSurveys.helpers({
  schemaVersionStore() {
    console.log('tmpl', Template.instance(), Template.instance().selectedSchema);
    return Template.instance().selectedSchema;
  },
  schemaVersions() {
    // TODO: add more Schemas versions
    return ['v2017'].map(item => ({ id: item, label: item }));
  },
  hudSurveys() {
    const surveyVersion = Template.instance().selectedSchema.get();
    console.log('here', surveyVersion);
    const surveys = Surveys.find({ hudSurvey: true, surveyVersion }).fetch();
    return surveys;
  },
  currentVersion() {
  },
});
