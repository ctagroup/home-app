import EligibleClients from '/imports/api/eligibleClients/eligibleClients';
import { fullName, getClientSchemaFromLinks } from '/imports/api/utils';
import { TableDom } from '/imports/ui/dataTable/helpers';
import './eligibleClientsListView.html';


const tableOptions = {
  columns: [
    {
      data: 'client',
      title: 'Client',
      render(client) {
        const url = Router.path('viewClient',
          { _id: client.id },
          { query: `schema=${client.schema}` }
        );
        return `<a href="${url}">${fullName(client)}</a>`;
      },
    },
    {
      title: 'Score',
      data: 'surveyScore',
      render(value, type, doc) {
        const client = doc.client;
        // console.log(client);
        const query = {
          clientId: doc.clientId,
          schema: client.schema,
        };
        if (client.schema) {
          const url = Router.path('adminDashboardresponsesView', {},
            { query }
          );
          return `<a href="${url}">${value}</a>`;
        }
        return value;
      },
    },
    {
      title: 'Survey Date',
      data: 'surveyDate',
    },
    {
      title: 'Match Status',
      data: 'matched',
      render(value) { return `${value}`; },
    },
  ],
  order: [
    [0, 'asc'],
  ],
  dom: TableDom,
};


Template.eligibleClientsListView.helpers({
  hasData() {
    return EligibleClients.find().count() > 0;
  },
  tableData() {
    return () => EligibleClients.find({}).fetch();
  },
  tableOptions() {
    return tableOptions;
  },
  loadData() {
    return () => ((pageNumber, pageSize, sort, order, callback) => {
      // console.log('callback', pageNumber, pageSize, sort, order, callback);
      const sortBy = Array.isArray(sort) ? sort[0] : sort;
      const orderBy = Array.isArray(order) ? order[0] : order;
      // return Meteor.subscribe('eligibleClients.page', pageNumber, pageSize, sortBy, orderBy);
      return Meteor.call('getEligibleClientsPage', pageNumber, pageSize, sortBy, orderBy,
        (err, res) => {
          res.content.forEach(eligibleClient => {
            const schema = getClientSchemaFromLinks(eligibleClient.links, 'v2015');
            Object.assign(eligibleClient.client, { schema });
            EligibleClients._collection.update(eligibleClient._id || eligibleClient.clientId, eligibleClient, {upsert: true}); // eslint-disable-line
          });
          const data = EligibleClients.find({}).fetch();
          const pages = res.page.totalPages;
          if (callback) callback({ data, pages });
        });
    });
  },
});

Template.eligibleClientsListView.events(
  {
    'click .postHousingMatchScores': () => {
      Meteor.call(
        'postHousingMatchScores', (err, res) => {
          if (err) {
            Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
          } else {
            Bert.alert(`${res}`, 'success', 'growl-top-right');
          }
        }
      );
    },
  }
);
