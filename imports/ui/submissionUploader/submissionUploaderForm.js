import { ReactiveVar } from 'meteor/reactive-var';
import * as Papa from 'papaparse';

import Surveys from '/imports/api/surveys/surveys';

import './submissionUploaderForm.html';
import './surveySelect.js';
import SubmissionUploaderSurveyConfigs from
  '../../api/submissionUploader/submissionUploaderSurveyConfigs';


Template.submissionUploaderForm.onCreated(() => {
  const template = Template.instance();
  template.uploading = new ReactiveVar(false);
  template.selectedSurveyId = new ReactiveVar(false);
  template.selectedSurveyDetails = new ReactiveVar({ loading: false });
  template.verified = new ReactiveVar(false);

  Tracker.autorun(() => {
    const surveyId = template.selectedSurveyId.get();
    if (!surveyId) return;
    template.selectedSurveyDetails.set({
      loading: true,
    });
    Meteor.call('surveys.getSurveySections', surveyId, (err, sections) => {
      template.selectedSurveyDetails.set({
        loading: false,
        data: { sections },
      });
    });
    Meteor.call('surveys.getSurveySectionQuestions', surveyId,
      (err, resp) => {
        if (resp) {
          const { sections, sectionQuestions } = resp;
          template.selectedSurveyDetails.set({
            loading: false,
            data: { sections, sectionQuestions },
          });
        }
      });
  });
});

Template.submissionUploaderForm.helpers({
  surveyConfig() {
    const surveyId = Template.instance().selectedSurveyId.get();
    const fileConfig = SubmissionUploaderSurveyConfigs.findOne(surveyId);
    // console.log('fileConfig', surveyId, fileConfig);
    if (fileConfig) return fileConfig.definition;
    return '';
  },
  surveySelected() {
    return Template.instance().selectedSurveyId.get();
  },
  selectedSurveyId() {
    return Template.instance().selectedSurveyId;
  },
  selectedSurveyDetails() {
    return Template.instance().selectedSurveyDetails.get();
  },
  selectedSurveySectionQuestions(sectionId) {
    const details = Template.instance().selectedSurveyDetails.get();
    if (details && details.data && details.data.sectionQuestions) {
      const { sectionQuestions } = details.data;
      const selectedSectionQuestions = sectionQuestions[sectionId];
      return selectedSectionQuestions;
    }
    return [];
  },
  surveyData() {
    const surveyId = Template.instance().selectedSurveyId.get();
    if (!surveyId) return {};
    const survey = Surveys.findOne(surveyId);
    if (!survey.definition) return {};
    const data = JSON.parse(survey.definition);
    return data;
  },
  uploading() {
    return Template.instance().uploading.get();
  },
  configVerified() {
    return Template.instance().verified.get();
  },
});

Template.submissionUploaderForm.events({
  'change [name="uploadCSV"]'(event, template) {
    const file = event.target.files[0];
    let fileId = false;
    const surveyId = template.selectedSurveyId.get();
    template.uploading.set(true);
    Meteor.call('submissionUploader.createFile', surveyId, file.name, (err, resp) => {
      let rowsCount = -1;
      if (err) {
        Bert.alert(err.reason, 'warning');
      } else {
        fileId = resp;

        Papa.parse(file, {
          step(row) {
            const parsed = row.data[0];
            if (parsed.length > 1 && !parsed.every(item => !item)) {
              rowsCount++;
              // Skip header:
              if (rowsCount === 0) return;
              Meteor.call('submissionUploader.parseUploadRow',
                surveyId, fileId, rowsCount, parsed,
                (error /* , response*/) => {
                  if (error) {
                    Bert.alert(error.reason, 'warning');
                  }
                });
            }
          },
          complete() {
            template.uploading.set(false);
            Bert.alert('Upload complete, processing started!', 'success', 'growl-top-right');
            Meteor.call('submissionUploader.setTotalRows', fileId, rowsCount);
            Meteor.call('submissionUploader.run', surveyId, fileId);
          },
        });
      }
    });
  },
  'submit #surveyConfigForm'(event, template) {
    event.preventDefault();
    const target = event.target;
    const definition = target.definition.value;
    const surveyId = template.selectedSurveyId.get();
    Meteor.call('submissionUploader.updateConfig', surveyId, definition, (error) => {
      if (error) {
        Bert.alert(error.reason, 'warning');
      } else {
        template.verified.set(true);
        Bert.alert('Config updated!', 'success', 'growl-top-right');
      }
    });
  },
});
