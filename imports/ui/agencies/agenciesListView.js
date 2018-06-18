import moment from 'moment';
import Agencies from '/imports/api/agencies/agencies';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
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
      data: '_id',
      title: 'Consent groups',
      render(value) {
        const consentGroups = ConsentGroups.find({ agencies: value }, { sort: { _id: 1 } }).fetch();
        return consentGroups.map(cg => cg._id).join(', ');
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
    return Agencies.find().count() > 0;
  },
  tableOptions() {
    return tableOptions;
  },
  tableData() {
    return () => Agencies.find().fetch();
  },
});
