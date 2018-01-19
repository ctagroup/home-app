import moment from 'moment';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { TableDom } from '/imports/ui/dataTable/helpers';
import Alert from '/imports/ui/alert';
import { fullName } from '/imports/api/utils';
import './searchClient.html';

// TODO: move to dedicated template
function generateMemberHtml(client) {
  return `<tr id="${client.clientId}">
            <td class="clientID">${client.clientId}</td>
            <td class="clientName">${client.clientName}</td>
            <td>
              <select class="relationshiptohoh" name="relationshiptohoh">
                <option value="1">Self</option>
                <option value="2">Head of household’s child</option>
                <option value="3">Head of household’s spouse or partner</option>
                <option value="4">
                  Head of household’s other relation member (other relation to head of household)
                </option>
                <option value="5">Other:  non-relation member</option>
              </select>
              <input type="hidden" name="householdMembershipId" class="householdMembershipId"
                value="" />
            </td>
            <td>
              <input type="radio" class="ihoh" name="ishoh" value=${client.clientId} />
            </td>
            <td>
              <a href="#" class="btn btn-danger deleteMember"><i class="fa fa-remove"></i></a>
            </td>
          </tr>`;
}


const tableOptions = {
  columns: [
    {
      title: 'Client Name',
      data: '_id',
      render(value) {
        const client = PendingClients.findOne({ _id: value });
        const name = (`${client.firstName.trim()} ${client.lastName.trim()}`).trim();
        return `<a href="/clients/${value}">${name}</a>`;
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


const debouncedSearch = _.debounce((query, options, callback) => {
  Meteor.call('searchClient', query, options, (err, res) => {
    if (err) {
      Alert.error(err);
    } else {
      const clients = res.map(r => ({
        ...r,
        fullName: fullName(r),
      }));
      callback(clients);
    }
  });
}, 1000);

Template.searchClient.helpers(
  {
    hasPendingClients() {
      return PendingClients.find().count() > 0;
    },
    tableOptions() {
      return tableOptions;
    },
    tableData() {
      return () => PendingClients.find().fetch();
    },


    isGlobalHousehold() {
      const route = Router.current().location.get().path.split('/')[1];
      return route === 'globalHouseholds';
    },
    searchClient(query, sync, callback) {
      const options = {
        limit: 10,
      };
      const route = Router.current().location.get().path.split('/')[1];
      if (route === 'globalHouseholds') {
        options.excludeLocalClients = true;
      }
      debouncedSearch(query, options, callback);
    },
    clientSelected(event, dataObject) {
      const route = Router.current().location.get().path.split('/')[1];
      if (route === 'globalHouseholds') {
        if (dataObject.clientNotFound) {
          $('#search-client-keyword').val(dataObject.query).change();
        } else {
          const client = {};
          client.clientId = dataObject._id;
          client.clientName =
            `${dataObject.firstName} ${dataObject.middleName} ${dataObject.lastName}`;

          if ($('.globalHouseholdMembers').find(`#${client.clientId}`).length < 1) {
            $('.globalHouseholdMembers').append(generateMemberHtml(client));
            $('.no-household-members-found-row').remove();
          }
        }
      } else {
        // NoOp Statement. Not going to be used anywhere.
        const temp = '';
        if (dataObject.clientNotFound) {
          $('#search-client-keyword').val(dataObject.query + temp).change();
          Router.go('adminDashboardclientsNew', {}, { query: `firstName=${dataObject.query}` });
        } else {
          const query = {};
          if (dataObject.isHMISClient) {
            query.query = `schema=${dataObject.schema}`;
          }
          Router.go('viewClient', { _id: dataObject._id }, query);
        }
      }
    },
    getRecentClients() {
      return Session.get('recentClients') || [];
    },
    alertMessages() {
      const params = Router.current().params;
      if (params && params.query && params.query.deleted) {
        return '<p class="notice bg-success text-success">Client is removed successfully.</p>';
      }
      return '';
    },
  }
);

Template.searchClient.events(
  {
    'click .client-search-icon-container': () => {
      $('#search-client-keyword').focus();
    },
  }
);

Template.searchClient.onRendered(
  () => {
    Meteor.typeahead.inject();
  }
);
