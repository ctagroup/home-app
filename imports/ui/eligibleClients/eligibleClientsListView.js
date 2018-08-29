import EligibleClients from '/imports/api/eligibleClients/eligibleClients';
import { fullName } from '/imports/api/utils';
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
