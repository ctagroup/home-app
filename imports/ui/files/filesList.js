import moment from 'moment';
import Files from '/imports/api/files/files';
import { deleteFileButton, TableDom } from '/imports/ui/dataTable/helpers';
import './filesList.html';

const tableOptions = {
  columns: [
    {
      title: 'Filename',
      data: 'fileId',
      render(value) {
        const upload = Files.Uploads.findOne(value);
        if (upload) {
          const url = upload.url();
          const { name } = upload.original;
          return `<a href="${url}">${name}</a>`;
        }
        return 'File not found';
      },
    },
    {
      title: 'Description',
      data: 'description',
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

Template.filesList.helpers({
  addFilePath() {
    const query = {
      clientId: this.client.clientId,
      schema: this.client.schema,
    };
    return Router.path('filesNew', {}, { query });
  },
  hasClient() {
    return !!this.client;
  },
  hasData() {
    return Files.find().count() > 0;
  },
  tableOptions() {
    if (!this.client || 1) {
      const clientColumn = {
        title: 'ClientId',
        data: 'clientId',
        render(value, _, rowData) {
          const query = {
            clientId: rowData.clientId,
            schema: rowData.clientSchema,
          };
          const url = Router.path('filesList', {}, { query });
          return `<a href="${url}">${value}</a>`;
        },
      };
      return {
        ...tableOptions,
        columns: [clientColumn, ...tableOptions.columns],
      };
    }
    return tableOptions;
  },
  tableData() {
    return () => Files.find().fetch();
  },
});
