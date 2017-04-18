/*
 TODO: This file should be in /imports/client/
       but router is currently being loaded also on the server-side
 */

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
      name: `${client.firstName.trim()} ${client.lastName.trim()}`,
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
} : undefined;

