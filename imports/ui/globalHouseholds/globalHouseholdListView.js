import GlobalHouseholds from '/imports/api/globalHouseholds/globalHouseholds';
import './globalHouseholdListView.html';


const tableOptions = {
  columns: [
    {
      title: 'Global Household ID',
      data: 'globalHouseholdId', // note: access nested data like this
    },
    {
      title: 'Head of HouseHold',
      data: 'globalHouseholdId', // note: access nested data like this
      render(val, type, doc) {
        if (doc.headOfHouseholdClient) {
          const hoh = doc.headOfHouseholdClient;
          const fName = hoh.firstName ? hoh.firstName : '';
          const mName = hoh.middleName ? hoh.middleName : '';
          const lName = hoh.lastName ? hoh.lastName : '';
          const url = Router.path(
            'viewClient',
            { _id: hoh.clientId },
            { query: `isHMISClient=true&schema=${hoh.schema}` }
          );
          return `<a href="${url}">${fName} ${mName} ${lName}</a>`;
        }
        return '-';
      },
    },
    {
      title: 'Date Created',
      data: 'dateCreated', // note: access nested data like this
      render(val) {
        if (val && val.month && val.dayOfMonth && val.year) {
          return `${val.month} ${val.dayOfMonth}, ${val.year}`;
        }
        return val;
      },
    },
    {
      title: 'Date Updated',
      data: 'dateUpdated', // note: access nested data like this
      render(val) {
        if (val && val.month && val.dayOfMonth && val.year) {
          return `${val.month} ${val.dayOfMonth}, ${val.year}`;
        }
        return val;
      },
    },
    {
      title: 'User',
      data: 'globalHouseholdId', // note: access nested data like this
      render(val, type, doc) {
        if (doc.userDetails === undefined) {
          return 'loading...';
        }
        if (doc.userDetails.error) {
          return doc.userDetails.error;
        }
        const fName = doc.userDetails.firstName;
        const lName = doc.userDetails.lastName;
        return `${fName} ${lName}`;
      },
    },
    {
      title: 'Active?',
      data: 'inactive',
      orderable: false,
      render(value) {
        return value ? '' : '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>'; // eslint-disable-line max-len
      },
    },
    HomeConfig.documentEditButton('adminDashboardglobalHouseholdsEdit'),
    HomeConfig.appDelButton,
  ],
  dom: HomeConfig.adminTablesDom,
};

/*
      tableColumns: [
      ],
      templates: {
        view: {
          name: 'globalHouseholdListView',
          data() {
            return {};
          },
          waitOn() {

          },
        },
        edit: {
          name: 'globalHouseholdEditView',
          waitOn() {
            const _id = Router.current().params._id;
            return Meteor.subscribe('singleGlobalHousehold', _id);
          },
          data() {
            const _id = Router.current().params._id;
            return GlobalHouseholds.findOne({ _id });
          },
        },
        new: {
          name: 'globalHouseholdCreateView',
        },
      },

*/

Template.globalHouseholdListView.helpers({
  hasData() {
    return GlobalHouseholds.find().count() > 0;
  },
  tableData() {
    return () => GlobalHouseholds.find().fetch();
  },
  tableOptions() {
    return tableOptions;
  },
});

