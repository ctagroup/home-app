import './surveySelect.html';
import Surveys from '/imports/api/surveys/surveys';

import { ReactiveVar } from 'meteor/reactive-var';

const NO_SURVEY_SELECTED = '--- No survey selected ---';

function surveyOptions(selectedSurveyId) {
  const allSurveys = Surveys.find().fetch();
  const options = allSurveys.map((survey) => ({
    value: survey._id,
    label: survey.title || survey._id,
    selected: selectedSurveyId && selectedSurveyId === survey._id,
  }));
  return [{
    value: null,
    label: NO_SURVEY_SELECTED,
  }, ...options];
}

Template.surveySelect.onCreated(() => {
  // using 2 variables for reactive helper handlers
  Template.instance().selectedSurvey = new ReactiveVar(false);
});

Template.surveySelect.onRendered(() => {
  if (Template.instance().data && Template.instance().data.selectedSurveyId) {
    Template.instance().selectedSurveyId = Template.instance().data.selectedSurveyId;
    Template.instance().selectedSurveyId.set(false);
  } else {
    Template.instance().selectedSurveyId = new ReactiveVar(false);
  }
});

Template.surveySelect.helpers({
  currentSurvey() {
    const selectedSurveyId = Template.instance().selectedSurvey ?
      Template.instance().selectedSurvey.get() : null;
    const selected = surveyOptions(selectedSurveyId).filter(p => p.selected);
    if (selected.length > 0) return selected[0].label;
    return Template.instance() && Template.instance().selectedSurvey
      && Template.instance().selectedSurvey.get()
      || NO_SURVEY_SELECTED;
  },
  options() {
    const selectedSurveyId = Template.instance().selectedSurveyId ?
      Template.instance().selectedSurveyId.get() : null;
    return surveyOptions(selectedSurveyId);
  },
});

Template.surveySelect.events({
  'change #survey-select'(event, tmpl) {
    const surveyId = event.target.value;
    tmpl.selectedSurveyId.set(surveyId);
    tmpl.selectedSurvey.set(surveyId);
  },
  'click .surveyItem'(event, tmpl) {
    const surveyId = this.value;
    tmpl.selectedSurveyId.set(surveyId);
    tmpl.selectedSurvey.set(surveyId);
  },
});
