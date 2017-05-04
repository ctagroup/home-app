import { Clients } from './clients';
import { HmisClient } from '../hmis-api';

Meteor.methods({
  updateClient(clientId, client, schema = 'v2015') {
    const hc = HmisClient.create(Meteor.userId());
    hc.api('client').updateClient(clientId, client, schema);
    return client;
  },

  removeClient(clientId) { // eslint-disable-line
    // should we remove client from hmis to pending collection?
    throw new Meteor.Error('500', 'Removing client is not yet implemented');
    // Clients.remove({ _id: clientId });
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    const ret = HMISAPI.updateClientMatchStatus(clientId, statusCode, comments, recipients);
    if (!ret) {
      throw new Meteor.Error('Error updating client match status.');
    }
    return ret;
  },

});
