/*
 TODO: This file should be in /imports/client/
       but router is currently being loaded also on the server-side
 */
import { fullName } from '/imports/api/utils';

export const RecentClients = Meteor.isClient ? {
  upsert(client) {
    const { _id, dedupClientId, schema } = client;
    let url;
    if (client.schema) {
      const query = {
        schema,
      };
      url = Router.path('viewClient', { _id }, { query });
    } else {
      url = Router.path('viewClient', { _id });
    }

    const recentClients = Session.get('recentClients') || [];
    const otherClients = recentClients.filter(r => r.dedupClientId !== dedupClientId);

    const data = {
      _id,
      dedupClientId,
      name: fullName(client),
      url,
    };
    Session.set('recentClients', [data, ...otherClients]);
    return data;
  },

  remove(client) {
    const { _id } = client;
    const recentClients = Session.get('recentClients') || [];
    Session.set('recentClients', recentClients.filter(r => r._id !== _id));
  },
} : undefined;

