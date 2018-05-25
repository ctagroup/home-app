import moment from 'moment';
import SubmissionUploaderFiles from '/imports/api/submissionUploader/submissionUploaderFiles';
import { deleteFileButton, TableDom } from '/imports/ui/dataTable/helpers';
// import Alert from '/imports/ui/alert';
import './submissionUploaderList.html';
import './submissionUploaderNew.js';

const tableOptions = {
  columns: [
    // {
    //   title: 'Filename',
    //   data: 'fileId',
    //   render(value) {
    //     const file = SubmissionUploaderFiles.findOne(value);
    //     return file && file.name || '';
    //     // if (upload) {
    //     //   const url = upload.url();
    //     //   const { name } = upload.original;
    //     //   return `<a href="${url}">${name}</a>`;
    //     // }
    //     // return 'File not found';
    //   },
    // },
    {
      title: 'Filename',
      data: 'name',
    },
    {
      title: 'Status',
      data: 'status',
      render(value) {
        console.log('status', value);
        return 'Queued';
      },
    },
    {
      title: 'Computed',
      data: 'totalRows',
      render(cellData, renderType, currentRow) {
        console.log('(cellData, renderType, currentRow)', cellData, renderType, currentRow);
        // You can return html strings, change sort order etc. here
        // Again, see jquery.dataTables docs
        // var img = "<img src='" + cellData + "' title='" + currentRow.profile.realname + "'>"
        // return img;
        return '';
      },
    },
    {
      title: 'Total',
      data: 'totalRows',
      render(value) {
        return value;
      },
    },
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
    // if (!this.client || 1) {
    //   const clientColumn = {
    //     title: 'ClientId',
    //     data: 'clientId',
    //     render(value, _, rowData) {
    //       const query = {
    //         clientId: rowData.clientId,
    //         schema: rowData.clientSchema,
    //       };
    //       const url = Router.path('submissionUploaderList', {}, { query });
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
    return () => SubmissionUploaderFiles.find().fetch();
  },
});

// Template.submissionUploaderList.events({
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
