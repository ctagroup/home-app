import { ReactiveVar } from 'meteor/reactive-var';
// import Papa from 'papaparse';
import * as Papa from 'papaparse';

import TempFiles from '/imports/api/submissionUploader/tempFiles';
import './tempFilesForm.js';
import './tempFilesNew.html';

Template.uploadSubmission.onCreated(() => {
  Template.instance().uploading = new ReactiveVar(false);
});

Template.uploadSubmission.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
});

Template.uploadSubmission.events({
  'change [name="uploadCSV"]'(event, template) {
    // We'll handle the conversion and upload here.
    Papa.parse(event.target.files[0], {
      header: true,
      step(row) {
        console.log('Row:', row.data);
      },
      complete() {
        console.log('All done!');
      },
      // complete(results /* , file*/) {
      //   Meteor.call('parseUpload', results.data, (error, response) => {
      //     if (error) {
      //       console.log(error.reason);
      //       Bert.alert(error.reason, 'warning');
      //     } else {
      //       console.log('response', response);
      //       template.uploading.set(false);
      //       Bert.alert('Upload complete!', 'success', 'growl-top-right');
      //     }
      //   });
      // },
    });
  },
});

Template.tempFilesNew.helpers({
  collection() {
    return TempFiles;
  },
  doc() {
    return {
      // clientId: this.client.clientId,
      // clientSchema: this.client.schema,
    };
  },
  schema() {
    return TempFiles.schema;
  },
});
