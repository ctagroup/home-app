import moment from 'moment';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import { TableDom } from '/imports/ui/dataTable/helpers';
import './agenciesListView.html';

const tableOptions = {
  columns: [
    {
      data: 'projectName',
      title: 'Name',
      render(value, op, doc) {
        return `<a href="${Router.path('agenciesEdit', { _id: doc._id })}">${value}</a>`;
      },
    },
    {
      data: 'projectCommonName',
      title: 'Common Name',
    },
    {
      data: 'description',
      title: 'Description',
    },
  ],
  dom: TableDom,
  processing: true,
  deferRender: true,
};


Template.agenciesListView.helpers({
  hasData() {
    return GlobalProjects.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => GlobalProjects.find().fetch();
  },
});
