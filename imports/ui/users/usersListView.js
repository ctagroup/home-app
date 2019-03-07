import moment from 'moment';
import { deleteUserButton, editButton, TableDom } from '/imports/ui/dataTable/helpers';
import { fullName } from '/imports/api/utils';
import './usersListView.html';

const tableOptions = {
  columns: [
    {
      title: 'Name',
      data: 'services.HMIS.name',
      render(value, _, rowData) {
        return fullName(rowData.services.HMIS);
      },
      dataAccessor(rowData) { return fullName(rowData.services.HMIS); },
      filterMethod(filter, row) {
        const value = fullName(row.services.HMIS || {});
        return value.toLowerCase().includes((filter.value || '').toLowerCase());
      },
    },
    {
      title: 'Email',
      data: 'services.HMIS.emailAddress',
      render(value, _, rowData) {
        if (!value) {
          value = rowData.services.HMIS.emailAddress; // eslint-disable-line
        }
        // some users have no email addresses
        if (value && value.length) {
          return value.toLowerCase();
        }
        return '';
      },
      dataAccessor(rowData) { return rowData.services.HMIS.emailAddress; },
      filterMethod(filter, row) {
        const value = row.services.HMIS.emailAddress || '';
        return value.toLowerCase().includes((filter.value || '').toLowerCase());
      },
    },
    {
      title: 'Mail',
      data: 'services.HMIS.emailAddress',
      _id: 'htmlEmailAddress',
      render(value, _, rowData) {
        if (!value) {
          value = rowData.services.HMIS.emailAddress; // eslint-disable-line
        }
        return `<a href="mailto:${value}" class="btn btn-default btn-xs"><i class="fa fa-envelope"></i></a>`; // eslint-disable-line max-len
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
    {
      title: 'Status',
      data: 'services.HMIS.status',
      searchable: false,
    },
    {
      title: 'Project Group',
      data: 'services.HMIS.projectGroup.projectGroupName',
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
