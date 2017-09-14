import { TableDom } from '/imports/ui/dataTable/helpers';
import EligibleClients from '/imports/api/eligibleClients/eligibleClients';
import './eligibleClientsListView.html';


const tableOptions = {
  columns: [
    {
      data: 'clientId',
      title: 'Client',
      render(value, type, doc) {
        const client = doc.clientDetails;
        if (client.loading) {
          return 'Loading...';
        }
        if (client.error) {
          return client.error;
        }

        const { firstName, middleName, lastName } = client;

        let displayName = `${firstName || ''} ${middleName || ''} ${lastName || ''}`;
        displayName = displayName.trim();

        if (!displayName) {
          displayName = doc.clientId;
        }

        if (client.schema) {
          const url = Router.path(
            'viewClient',
            { _id: client.clientId },
            { query: `isHMISClient=true&schema=${client.schema}` }
          );
          return `<a href="${url}">${displayName}</a>`;
        }
        return displayName;
      },
    },
    {
      title: 'Score',
      data: 'surveyScore',
      render(value, type, doc) {
        const client = doc.clientDetails;
        if (client.schema) {
          const url = Router.path(
            'adminDashboardresponsesView',
            { _id: client.clientId },
            { query: `clientID=${client.clientId}` }
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
