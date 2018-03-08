import moment from 'moment';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import { TableDom } from '/imports/ui/dataTable/helpers';
import './agenciesListView.html';

const tableOptions = {
  columns: [
    {
      data: 'agencyName',
      title: 'Name',
      render(value, op, doc) {
        return `<a href="${Router.path('agenciesEdit', { _id: doc._id })}">${value}</a>`;
      },
    },
    {
      data: 'createdAt',
      title: 'Created At',
      render(value, type) {
        if (type === 'sort') {
          return value;
        }
        return moment(value).format('MM/DD/YYYY h:mm A');
      },
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
