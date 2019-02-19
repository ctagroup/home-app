import { eachLimit } from 'async';
import Responses from '/imports/api/responses/responses';
import { logger } from '/imports/utils/logger';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { HmisClient } from '/imports/api/hmisApi';
import { ResponsesAccessRoles } from '/imports/config/permissions';


import {
  mergeClient,
} from '/imports/api/clients/helpers';

Meteor.publish('responses.all', function publishResponses(ofClientId, schema) {
  logger.info(`PUB[${this.userId}]: responses.all`, ofClientId, schema);
  check(ofClientId, String);
  check(schema, String);
  if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
    return [];
  }

  let stopFunction = false;
  this.unblock();

  this.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);

  if (this.userId) {
    let clientIds = [ofClientId];
    const clientsCache = {};
    const queue = [];
    if (schema) {
      // schema
      clientsCache[ofClientId] = hc.api('client').getClient(ofClientId, schema);
      const client = clientsCache[ofClientId];
      const clientVersions = hc.api('client').searchClient(client.dedupClientId, 50);
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
      this.added('responses', response._id, response);
    }
    this.ready();

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
        this.changed('responses', responseId, { clientDetails: clientsCache[clientId] });
        callback();
      });
    });
  }
  return this.ready();
});

Meteor.publish('responses.one', function publishSingleResponse(responseId) {
  logger.info(`PUB[${this.userId}]: responses.one`, responseId);
  check(responseId, String);
  if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
    return [];
  }

  const hc = HmisClient.create(this.userId);

  if (this.userId) {
    const response = Responses.findOne({ _id: responseId });
    if (!response) {
      return this.ready();
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
      this.added('responses', response._id, response);
      this.ready();
    } else {
      const localClient = PendingClients.findOne({ _id: response.clientId });
      response.clientDetails = localClient;
    }
    this.added('responses', response._id, response);
  }
  return this.ready();
});

Meteor.publish('responses.enrollments', function publishSingleResponse(enrollmentIds) {
  logger.info(`PUB[${this.userId}]: responses.enrollments`, enrollmentIds);
  check(enrollmentIds, [String]);
  if (!Roles.userIsInRole(this.userId, ResponsesAccessRoles)) {
    return [];
  }

  return Responses.find({
    'enrollment.enrollment-0.id': { $in: enrollmentIds },
  });
});
