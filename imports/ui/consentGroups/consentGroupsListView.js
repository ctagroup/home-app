import moment from 'moment';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import { TableDom } from '/imports/ui/dataTable/helpers';
import Agencies from '/imports/api/agencies/agencies';
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
      data: 'agencies',
      title: 'Agencies',
      render(value) {
        const agencies = value.map(id => {
          const agency = Agencies.findOne(id);
          return agency ? agency.agencyName : id;
        }).join(', ');
        return agencies;
        // return `<a href="${Router.path('consentGroupsEdit', { _id: doc._id })}">${value}</a>`;
      },
    },
    {
      data: '_id',
      title: '# projects',
      render(value) {
        return ConsentGroups.findOne(value).getAllProjects().length;
      },
    },
    {
      data: 'status',
      title: 'Status',
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
