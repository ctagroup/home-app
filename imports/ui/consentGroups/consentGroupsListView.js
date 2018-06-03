import moment from 'moment';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import { TableDom } from '/imports/ui/dataTable/helpers';
import './consentGroupsListView.html';

const tableOptions = {
  columns: [
    {
      data: 'name',
      title: 'Name',
      render(value, op, doc) {
        return `<a href="${Router.path('consentGroupsEdit', { _id: doc._id })}">${value}</a>`;
      },
    },
    {
      data: 'description',
      title: 'Description',
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


Template.consentGroupsListView.helpers({
  hasData() {
    return ConsentGroups.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => ConsentGroups.find().fetch();
  },
});
