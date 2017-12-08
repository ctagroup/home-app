/*
 TODO: This file should be in /imports/client/
       but router is currently being loaded also on the server-side
 */
import { fullName } from '/imports/api/utils';

export const RecentClients = Meteor.isClient ? {
  upsert(client) {
    const recentClients = Session.get('recentClients') || [];
    const ids = _.pluck(recentClients, '_id');
    const idx = ids.indexOf(client._id);

    if (idx !== -1) {
      recentClients.splice(idx, 1);
    }

    const data = {
      _id: client._id,
      name: fullName(client),
      url: client.url,
    };
    Session.set('recentClients', [data, ...recentClients]);
  },

  remove(clientId) {
    const recentClients = Session.get('recentClients') || [];
    const ids = _.pluck(recentClients, '_id');
    const idx = ids.indexOf(clientId);

    if (idx !== -1) {
      recentClients.splice(idx, 1);
    }
    Session.set('recentClients', recentClients);
  },

  updateId(oldClientId, newClient) {
    const { clientId, schema } = newClient;
    const recentClients = Session.get('recentClients') || [];
    const updated = recentClients.map(c => {
      if (c._id === oldClientId) {
        return {
          ...c,
          _id: clientId,
          url: Router.path('viewClient', { _id: clientId }, { query: { schema } }),
        };
      }
      return c;
    });
    Session.set('recentClients', updated);
  },
} : undefined;

