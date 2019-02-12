import moment from 'moment';
import { TableDom } from '/imports/ui/dataTable/helpers';
import { ReactiveVar } from 'meteor/reactive-var';
import './viewAllClient.html';

const tableOptions = {
  columns: [
    {
      title: 'Client Name',
      data(row) {
        const name = (`${row.firstName.trim()} ${row.lastName.trim()}`).trim();
        return `<a href="/clients/${row.clientId}?schema=${row.schema}">${name}</a>`;
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

Template.viewAllClient.onCreated(function () {
  const searchKey = Router.current().params.searchKey || '';
  this.records = new ReactiveVar(0);
  Meteor.call('searchClient', searchKey, { limit: 0 }, (err, res) => {
    if (err) {
      tableData = [];
    } else {
      this.records.set(res.length);
      tableData = res;
    }
  });
});

Template.viewAllClient.helpers(
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
