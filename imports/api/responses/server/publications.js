import { eachLimit } from 'async';
import Responses from '/imports/api/responses/responses';
import { logger } from '/imports/utils/logger';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.publish('responses.all', function publishResponses(ofClientId) {
  logger.info(`PUB[${this.userId}]: responses.all`, ofClientId);
  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);

  if (self.userId) {
    const queue = [];
    const responses = (
      ofClientId ? Responses.find({ clientId: ofClientId, version: 2 })
        : Responses.find({ version: 2 })
    ).fetch();
    // Publish the local data first, so the user can get a quick feedback.
    for (let i = 0, len = responses.length; i < len; i++) {
      const response = responses[i];
      const { clientId, clientSchema } = response;
      if (clientSchema) {
        response.clientDetails = { loading: true };
        queue.push({
          responseId: responses[i]._id,
          clientId,
          clientSchema,
        });
      } else {
        response.clientDetails = PendingClients.findOne({ _id: clientId })
        || { error: 'client not found (404)' };
      }
      self.added('responses', responses[i]._id, responses[i]);
    }
    self.ready();

    eachLimit(queue, Meteor.settings.connectionLimit, (data, callback) => {
      if (stopFunction) {
        callback();
        return;
      }
      // TODO: add cache
      Meteor.defer(() => {
        const { responseId, clientId, schema } = data;
        let clientDetails;
        try {
          clientDetails = hc.api('client').getClient(clientId, schema);
          clientDetails.schema = schema;
        } catch (e) {
          clientDetails = { error: e.reason };
        }
        self.changed('responses', responseId, { clientDetails });
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
    const response = Responses.findOne({ _id: responseId, version: 2 });
    if (!response) {
      return [];
    }

    const { isHMISClient, clientId, clientSchema } = response;

    if (isHMISClient && clientSchema) {
      try {
        response.clientDetails = hc.api('client').getClient(clientId, clientSchema);
      } catch (e) {
        response.clientDetails = { error: e.reason };
      }
      self.added('responses', response._id, response);
      self.ready();
    } else {
      const localClient = PendingClients.findOne({ _id: response.clientID });
      response.clientDetails = localClient;
    }
    self.added('responses', response._id, response);
  }
  return self.ready();
});
