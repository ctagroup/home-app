import { deleteHouseholdButton, editButton, TableDom } from '/imports/ui/dataTable/helpers';
import GlobalHouseholds from '/imports/api/globalHouseholds/globalHouseholds';
import { fullName } from '/imports/api/utils';
import './globalHouseholdListView.html';


const tableOptions = {
  columns: [
    {
      title: 'Global Household ID',
      data: 'genericHouseholdId', // note: access nested data like this
      minWidth: 150,
    },
    {
      title: 'Head of HouseHold',
      data: 'genericHouseholdId', // note: access nested data like this
      minWidth: 150,
      render(val, type, doc) {
        const client = doc.headOfHouseholdClient;
        if (client.loading) {
          return 'Loading...';
        }
        if (client.error) {
          return client.error;
        }
        const url = Router.path(
          'viewClient',
          { _id: client.clientId },
          { query: `schema=${client.schema}` }
        );
        return `<a href="${url}">${fullName(client)}</a>`;
      },
    },
    {
      title: 'Date Created',
      data: 'dateCreated', // note: access nested data like this
      minWidth: 120,
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
      minWidth: 120,
      render(val) {
        if (val && val.month && val.dayOfMonth && val.year) {
          return `${val.month} ${val.dayOfMonth}, ${val.year}`;
        }
        return val;
      },
    },
    {
      title: 'User',
      data: 'genericHouseholdId', // note: access nested data like this
      minWidth: 180,
      render(val, type, doc) {
        const user = doc.userDetails;
        if (user.loading) {
          return 'Loading...';
        }
        if (user.error) {
          return user.error;
        }
        return fullName(user);
      },
    },
    {
      title: 'Active?',
      data: 'inactive',
      minWidth: 80,
      orderable: false,
      render(value) {
        return value ? '' : '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>'; // eslint-disable-line max-len
      },
    },
    editButton('adminDashboardglobalHouseholdsEdit'),
    deleteHouseholdButton(),
  ],
  dom: TableDom,
};

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

