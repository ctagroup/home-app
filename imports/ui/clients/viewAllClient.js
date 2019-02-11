import { Mongo } from 'meteor/mongo';
//const SearchClient = Meteor.isClient ? new Mongo.Collection('search') : undefined;
const SearchClient = new Mongo.Collection('search');

import moment from 'moment';
import { TableDom } from '/imports/ui/dataTable/helpers';
import Alert from '/imports/ui/alert';
import { fullName,viewAll } from '/imports/api/utils';
import './viewAllClient.html';

const tableOptions = {
  columns: [
    {
      title: 'Client Name',
	  data: function(row){
		  const name = (`${row.firstName.trim()} ${row.lastName.trim()}`).trim();
		  return `<a href="/clients/${row.clientId}?schema=${row.schema}">${name}</a>`;
	  }
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

console.log(SearchClient.find().count());
Template.viewAllClient.helpers(
  {
    tableOptions() {
      return tableOptions;
    },
   tableData() { 
	return () => SearchClient.find({}).fetch();
   }
  }
);

// const dummy=[{name: 'shanni',dob: '11-12'},{name:'shanni2',dob: '12-12'}];
// Template.viewAllClient.helpers(
  // {
    // tableOptions() {
      // return tableOptions;
    // },
   // tableData() {
      // return () => dummy.map(r => ({...r}))
    // }
  // }
// );




