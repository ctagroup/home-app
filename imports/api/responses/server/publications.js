import { eachLimit } from 'async';
import Responses from '/imports/api/responses/responses';
import { logger } from '/imports/utils/logger';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { HmisClient } from '/imports/api/hmisApi';
import {
  mergeClient,
} from '/imports/api/clients/helpers';

Meteor.publish('responses.all', function publishResponses(ofClientId, schema) {
  logger.info(`PUB[${this.userId}]: responses.all`, ofClientId, schema);
  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);

  if (self.userId) {
    let clientIds = [ofClientId];
    const clientsCache = {};
    const queue = [];
    if (schema) {
      // schema
      clientsCache[ofClientId] = hc.api('client').getClient(ofClientId, schema);
      const client = clientsCache[ofClientId];
      const clientVersions = hc.api('client').searchClient(client.dedupClientId);
      clientVersions.forEach(item => { clientsCache[item.id] = item; });
      const mergedClient = mergeClient(clientVersions, schema);
      clientIds = mergedClient.clientVersions.map(({ clientId }) => clientId);
    }

    const responses = (
      ofClientId ? Responses.find({ clientId: { $in: clientIds } })
        : Responses.find()
    ).fetch();
    // Publish the local data first, so the user can get a quick feedback.
    for (let i = 0, len = responses.length; i < len; i++) {
      const response = responses[i];
      const { clientId, clientSchema } = response;
      if (clientSchema) {
        response.clientDetails = { loading: true };
        queue.push({
          responseId: response._id,
          clientId,
          clientSchema,
        });
      } else {
        response.clientDetails = PendingClients.findOne({ _id: clientId })
        || { error: 'client not found (404)' };
      }
      self.added('responses', response._id, response);
    }
    self.ready();

    eachLimit(queue, Meteor.settings.connectionLimit, (data, callback) => {
      if (stopFunction) {
        callback();
        return;
      }
      Meteor.defer(() => {
        const apiEndpoint = hc.api('client'); // .disableError(404);
        const { responseId, clientId, clientSchema } = data;
        if (!clientsCache[clientId]) {
          try {
            clientsCache[clientId] = apiEndpoint.getClient(clientId, clientSchema);
            clientsCache[clientId].schema = clientSchema;
          } catch (e) {
            clientsCache[clientId] = { error: e.reason };
          }
        }
        self.changed('responses', responseId, { clientDetails: clientsCache[clientId] });
        callback();
      });
    });
  }
  return self.ready();
});

Meteor.publish('responses.one', function publishSingleResponse(responseId) {
  logger.info(`PUB[${this.userId}]: responses.one`, responseId);
  const self = this;
  const hc = HmisClient.create(this.userId);

  if (self.userId) {
    const response = Responses.findOne({ _id: responseId });
    if (!response) {
      return self.ready();
    }

    const { clientId, clientSchema } = response;

    if (clientId && clientSchema) {
      try {
        const client = hc.api('client').getClient(clientId, clientSchema);
        response.clientDetails = {
          ...client,
          schema: clientSchema,
        };
      } catch (e) {
        response.clientDetails = { error: e.reason };
      }
      self.added('responses', response._id, response);
      self.ready();
    } else {
      const localClient = PendingClients.findOne({ _id: response.clientId });
      response.clientDetails = localClient;
    }
    self.added('responses', response._id, response);
  }
  return self.ready();
});
