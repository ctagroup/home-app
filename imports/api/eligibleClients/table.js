import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import EligibleClients from '/imports/api/eligibleClients/eligibleClients';
import { EligibleClientsCache } from '/imports/both/cached-subscriptions';


const table = new Tabular.Table({
  name: 'Eligible Clients',
  collection: EligibleClients,
  columns: [
    {
      data: 'clientId',
      title: 'Client',
      render(value, type, doc) {
        const client = doc.clientDetails;
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
  templates: {
    view: {
      name: 'eligibleClientsListView',
      data() {
        return {};
      },
      waitOn() {
        return EligibleClientsCache.subscribe('eligibleClients');
      },
    },
  },

});


export default table;
