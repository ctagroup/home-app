import moment from 'moment';
import TempFiles from '/imports/api/submissionUploader/tempFiles';
import { deleteFileButton, TableDom } from '/imports/ui/dataTable/helpers';
// import Alert from '/imports/ui/alert';
import './tempFilesList.html';

const tableOptions = {
  columns: [
    {
      title: 'Filename',
      data: 'fileId',
      render(value) {
        const upload = TempFiles.Uploads.findOne(value);
        if (upload) {
          const url = upload.url();
          const { name } = upload.original;
          return `<a href="${url}">${name}</a>`;
        }
        return 'File not found';
      },
    },
    // {
    //   title: 'Status',
    //   data: 'status',
    // },
    {
      title: 'Uploaded At',
      data: 'createdAt',
      render(value) {
        return moment(value).format('MM/DD/YYYY hh:mm A');
      },
    },
    deleteFileButton(),
  ],
  dom: TableDom,
};

Template.tempFilesList.helpers({
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
    return TempFiles.find().count() > 0;
  },
  tableOptions() {
    // if (!this.client || 1) {
    //   const clientColumn = {
    //     title: 'ClientId',
    //     data: 'clientId',
    //     render(value, _, rowData) {
    //       const query = {
    //         clientId: rowData.clientId,
    //         schema: rowData.clientSchema,
    //       };
    //       const url = Router.path('tempFilesList', {}, { query });
    //       return `<a href="${url}">${value}</a>`;
    //     },
    //   };
    //   return {
    //     ...tableOptions,
    //     columns: [clientColumn, ...tableOptions.columns],
    //   };
    // }
    return tableOptions;
  },
  tableData() {
    return () => TempFiles.find().fetch();
  },
});

// Template.tempFilesList.events({
//   'click .approve'(e) {
//     e.preventDefault();
//     Meteor.call('mc211.approveClientFiles', this.client, (err) => {
//       if (err) {
//         Alert.error(err);
//       } else {
//         Alert.success('Approval email sent');
//       }
//     });
//   },
//   'click .reject'(e) {
//     e.preventDefault();
//     Meteor.call('mc211.rejectClientFiles', this.client, (err) => {
//       if (err) {
//         Alert.error(err);
//       } else {
//         Alert.success('Rejection email sent');
//       }
//     });
//   },
// });
