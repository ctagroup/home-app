import moment from 'moment';
import { logger as globalLogger } from '/imports/utils/logger';
import { ClientsAccessRoles } from '/imports/config/permissions';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { ClientsCache } from '/imports/api/clients/clientsCache';
import { HmisClient } from '/imports/api/hmisApi';
import { mergeByDedupId, filterClientForCache } from '/imports/api/clients/helpers';
import eventPublisher, {
  ClientCreatedEvent,
  ClientUpdatedEvent,
} from '/imports/api/eventLog/events';


Meteor.methods({
  'clients.create'(client, schema = 'v2017', clientVersion = false) {
    const clientData = _.omit(client, 'photo', 'signature');

    globalLogger.info(`METHOD[${this.userId}]: clients.create`, clientData);

    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const result = hc.api('client').createClient(clientData, schema);

    if (clientVersion) return result;

    try {
      Meteor.call('s3bucket.put', result.dedupClientId, 'photo', client.photo);
      Meteor.call('s3bucket.put', result.dedupClientId, 'signature', client.signature);
    } catch (err) {
      globalLogger.error('Failed to upload photo/signature to s3', err);
    }

    if (client.signature) {
      try {
        const data = {
          clientId: result.dedupClientId,
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().add(1, 'years').format('YYYY-MM-DD'),
          notes: 'client created',
          signature: client.signature,
        };
        Meteor.call('roiApi', 'createRoi', data);
      } catch (err) {
        globalLogger.error('Failed to create ROI for client', err);
      }
    }

    eventPublisher.publish(new ClientCreatedEvent(result, { userId: this.userId }));

    return result;
  },

  'clients.update'(clientId, client, schema) {
    const clientData = _.omit(client, 'photo', 'signature');
    globalLogger.info(`METHOD[${this.userId}]: clients.update`, clientId, schema, clientData);

    check(clientId, String);
    check(schema, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    hc.api('client').updateClient(clientId, clientData, schema);

    try {
      const { dedupClientId } = hc.api('client').getClient(clientId, schema);
      if (client.photo) {
        Meteor.call('s3bucket.put', dedupClientId, 'photo', client.photo);
      }
      if (client.signature) {
        Meteor.call('s3bucket.put', dedupClientId, 'signature', client.signature);
      }
    } catch (err) {
      globalLogger.error('Failed to upload photo/signature to s3', err);
    }

    eventPublisher.publish(new ClientUpdatedEvent({
      ...clientData,
      clientId,
      schema,
    }, { userId: this.userId }));

    return client;
  },

  'clients.service'(clientId, data, schema) {
    globalLogger.info(`METHOD[${this.userId}]: clients.service`, clientId, schema, data);
    check(clientId, String);
    check(schema, String);
    const hc = HmisClient.create(this.userId);
    // TODO: security add role check
    hc.api('client').updateClient(clientId, data, schema);

    eventPublisher.publish(new ClientUpdatedEvent({
      ...data,
      clientId,
      schema,
    }, { userId: this.userId }));

    return data;
  },

  'clients.delete'(clientId, schema) { // eslint-disable-line
    globalLogger.info(`METHOD[${this.userId}]: clients.delete`, clientId);

    check(clientId, String);
    check(schema, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    hc.api('client').deleteClient(clientId, schema);
  },

  'clients.updateMatchStatus'(clientId, statusCode, comments, recipients) {
    globalLogger.info(`METHOD[${this.userId}]: clients.updateMatchStatus`,
      clientId, statusCode, comments, recipients
    );

    check(clientId, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching').updateClientMatchStatus(
      clientId, statusCode, comments, recipients
    );
  },

  async searchClient(query, options = {}) {
    globalLogger.info(`METHOD[${this.userId}]: searchClient(${query})`);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const { page, excludeLocalClients } = options || {};
    let { sort, order, limit } = options || {};
    sort = sort || 'firstName';
    order = order || 'asc';
    limit = Math.min(limit, 500);

    const startIndex = page * limit;
    const hc = HmisClient.create(this.userId);
    let hmisClients = hc.api('client').searchClient(query, limit, startIndex, sort, order);

    hmisClients = hmisClients.filter(client => client.link);

    globalLogger.debug('search results', hmisClients.length);

    let localClients = [];
    if (!excludeLocalClients) {
      try {
        localClients = PendingClients.aggregate([
          {
            $project: {
              firstName: '$firstName',
              middleName: '$middleName',
              lastName: '$lastName',
              personalId: '$personalId',
              fullName: {
                $concat: [
                  { $ifNull: ['$firstName', ''] },
                  ' ',
                  { $ifNull: ['$middleName', ''] },
                  ' ',
                  { $ifNull: ['$lastName', ''] },
                ],
              },
            },
          },
          {
            $match: {
              fullName: new RegExp(query.split(' ').join('(.*)'), 'i'),
            },
          },

          {
            $sort: {
              firstName: 1,
            },
          },
          {
            $limit: limit,
          },
        ], { explain: false });
      } catch (err) {
        globalLogger.warn(err);
      }

      localClients = await localClients.toArray();

      // Removing entries where we have data coming from HMIS.
      for (let i = localClients.length - 1; i >= 0; i -= 1) {
        for (let j = 0; j < hmisClients.length; j += 1) {
          if (localClients[i].personalId === hmisClients[j].clientId) {
            // Remove.
            localClients.splice(i, 1);
            break;
          }
        }
      }
    }

    let mergedClients = [];

    if (localClients.length === 0 && hmisClients.length === 0) {
      mergedClients.push(
        {
          firstName: 'Create New',
          lastName: 'Client',
          query,
          clientNotFound: true,
        }
      );
    } else {
      hmisClients = hmisClients.map(
        (client) => {
          const clientz = client;
          clientz._id = clientz.clientId;
          clientz.isHMISClient = true;
          clientz.schema = clientz.schema || client.link.split('/')[3];
          return clientz;
        }
      );
      hmisClients = mergeByDedupId(hmisClients);
      mergedClients = localClients.map(
        (client) => {
          const clientz = client;
          clientz.isLocalClient = true;
          return clientz;
        }
      ).concat(
        hmisClients
      );
    }
    return mergedClients;
  },

  reloadClients() {
    this.unblock();
    const hc = HmisClient.create(this.userId);
    const clients = hc.api('client').getAllClients() || [];
    const clientBasics = clients.map(filterClientForCache);
    ClientsCache.rawCollection().insertMany(clientBasics, { ordered: false });
  },
});

Meteor.injectedMethods({
  'clients.get'(clientId, schema) {
    const { clientsRepository, logger } = this.context;
    logger.info(`PUB[${this.userId}]: clients.get(${clientId}, ${schema})`);

    check(clientId, String);
    check(schema, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    return clientsRepository.getClientByIdAndSchema(clientId, schema);
  },
});

