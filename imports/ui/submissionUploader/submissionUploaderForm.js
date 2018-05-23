import { ReactiveVar } from 'meteor/reactive-var';
// import Papa from 'papaparse';
import * as Papa from 'papaparse';

import './submissionUploaderForm.html';
import './surveySelect.js';
import SubmissionUploaderSurveyConfigs from
  '../../api/submissionUploader/submissionUploaderSurveyConfigs';

Template.submissionUploaderForm.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
  Template.instance().selectedSurveyId = new ReactiveVar(false);
  Template.instance().verified = new ReactiveVar(false);
});

Template.submissionUploaderForm.helpers({
  surveyConfig() {
    const surveyId = Template.instance().selectedSurveyId.get();
    const fileConfig = SubmissionUploaderSurveyConfigs.findOne(surveyId);
    console.log('fileConfig', surveyId, fileConfig);
    if (fileConfig) return fileConfig.definition;
    return '';
  },
  surveySelected() {
    return Template.instance().selectedSurveyId.get();
  },
  selectedSurveyId() {
    return Template.instance().selectedSurveyId;
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
    let rowsCount = 0;
    let fileId = false;
    const surveyId = template.selectedSurveyId.get();
    template.uploading.set(true);
    Meteor.call('submissionUploader.createFile', surveyId, file.name, (err, resp) => {
      if (err) {
        console.log(err.reason);
        Bert.alert(err.reason, 'warning');
      } else {
        fileId = resp;
        // Bert.alert('File metadata is set!', 'success', 'growl-top-right');
        Papa.parse(file, {
          step(row) {
            const parsed = row.data[0];
            if (parsed.length > 1 && !parsed.every(item => !item)) {
              // Skip header:
              if (rowsCount === 0) { rowsCount++; return; }
              Meteor.call('submissionUploader.parseUploadRow',
                surveyId, fileId, rowsCount - 1, parsed,
                (error, response) => {
                  if (error) {
                    console.log(error.reason);
                    Bert.alert(error.reason, 'warning');
                  } else {
                    rowsCount++;
                    console.log('job inserted: Id', response);
                  }
                });
            }
          },
          complete() {
            template.uploading.set(false);
            Bert.alert('Upload complete!', 'success', 'growl-top-right');
            Meteor.call('submissionUploader.setTotalRows', fileId, rowsCount - 1);
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
    Meteor.call('submissionUploader.updateConfig', surveyId, definition, (error, response) => {
      if (error) {
        console.log(error.reason);
        Bert.alert(error.reason, 'warning');
      } else {
        console.log('parseUpload call', response);
        template.verified.set(true);
        Bert.alert('Config updated!', 'success', 'growl-top-right');
      }
    });
  },
});
