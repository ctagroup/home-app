import moment from 'moment';
import { TableDom } from '/imports/ui/dataTable/helpers';
import { ReactiveVar } from 'meteor/reactive-var';
import './viewAllClients.html';

const tableOptions = {
  columns: [
    {
      title: 'Client Name',
      data(row) {
        const url = Router.path('viewClient',
          { _id: row.clientId },
          { query: `schema=${row.schema}` }
        );
        return `<a href="${url}">${row.firstName.trim()} ${row.lastName.trim()}</a>`;
      },
    },
    {
      title: 'Date of Birth',
      data: 'dob',
      render(value) {
        return moment(value).format('MM/DD/YYYY');
      },
    },
  ],
  dom: TableDom,
};

let tableData = [];

Template.viewAllClients.onCreated(function () {
  const searchKey = Router.current().params.searchKey || '';
  this.records = new ReactiveVar(0);
  Meteor.call('searchClient', searchKey, { limit: 1000 }, (err, res) => {
    if (err) {
      tableData = [];
    } else {
      this.records.set(res.length);
      tableData = res;
    }
  });
});

Template.viewAllClients.helpers(
  {
    hasData() {
      return Template.instance().records.get() > 0;
    },
    tableOptions() {
      return tableOptions;
    },
    tableData() {
      return () => tableData.map(r => ({ ...r }));
    },
  }
);
