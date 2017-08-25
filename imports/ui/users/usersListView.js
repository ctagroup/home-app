import moment from 'moment';
import { deleteUserButton, editButton, TableDom } from '/imports/ui/dataTable/helpers';
import './usersListView.html';

const tableOptions = {
  columns: [
    {
      title: 'Name',
      data: 'services.HMIS.name',
      render(value, _, rowData) {
        if (value) {
          const trimmed = value.trim();
          if (trimmed.length) {
            return trimmed;
          }
        }
        return rowData._id;
      },
    },
    {
      title: 'Email',
      data: 'services.HMIS.emailAddress',
      render(value) {
        // some users have no email addresses
        if (value && value.length) {
          return value.toLowerCase();
        }
        return '';
      },
    },
    {
      title: 'Mail',
      data: 'services.HMIS.emailAddress',
      createdCell(node, value) {
        $(node).html(`<a href="mailto:${value}" class="btn btn-default btn-xs"><i class="fa fa-envelope"></i></a>`); // eslint-disable-line max-len
      },
      width: '40px',
      searchable: false,
      orderable: false,
    },
    {
      title: 'Joined',
      data: 'createdAt',
      render(value) {
        return moment(value).format('MM/DD/YYYY');
      },
      searchable: false,
    },
    editButton('adminDashboardusersEdit'),
    deleteUserButton(),
  ],
  dom: TableDom,
};

Template.usersListView.helpers({
  hasData() {
    return Meteor.users.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => Meteor.users.find().fetch();
  },
});
