import moment from 'moment';
import SubmissionUploaderFiles from '/imports/api/submissionUploader/submissionUploaderFiles';
import Jobs, { JobStatus } from '/imports/api/jobs/jobs';
import { TableDom } from '/imports/ui/dataTable/helpers';

import './submissionUploaderList.html';
import './submissionUploaderNew.js';

const tableOptions = {
  columns: [
    {
      title: 'Filename',
      data: 'name',
    },
    {
      title: 'Total',
      data: 'totalRows',
    },
    {
      title: 'Processed',
      data: '_id',
      render(fileId) {
        return Jobs.find({ queue: fileId, status: JobStatus.SUCCESS }).count();
      },
    },
    {
      title: 'Failed',
      data: '_id',
      render(fileId) {
        return Jobs.find({ queue: fileId, status: JobStatus.FAILED }).count();
      },
    },
    {
      title: 'Uploaded At',
      data: 'createdAt',
      render(value) {
        return moment(value).format('MM/DD/YYYY hh:mm A');
      },
    },
    // deleteFileButton(),
  ],
  dom: TableDom,
};

Template.submissionUploaderList.onCreated(function loadUploaderList() {
  this.subscribe('submissionUploader.jobs');
});

Template.submissionUploaderList.helpers({
  addFilePath() {
    const query = {
      // clientId: this.client.clientId,
      // schema: this.client.schema,
    };
    return Router.path('filesNew', {}, { query });
  },
  hasClient() {
    return !!this.client;
  },
  hasData() {
    return SubmissionUploaderFiles.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => SubmissionUploaderFiles.find().fetch();
  },
});
