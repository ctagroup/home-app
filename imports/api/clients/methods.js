import { logger } from '/imports/utils/logger';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { ClientsCache } from '/imports/api/clients/clientsCache';
import { HmisClient } from '/imports/api/hmisApi';
import { mergeByDedupId, filterClientForCache } from '/imports/api/clients/helpers';
import eventPublisher, {
  ClientCreatedEvent,
  ClientUpdatedEvent,
} from '/imports/api/eventLog/events';

Meteor.methods({
  'clients.create'(client, schema = 'v2017') {
    logger.info(`METHOD[${this.userId}]: clients.create`, client);
    const hc = HmisClient.create(this.userId);
    const result = hc.api('client').createClient(client, schema);

    try {
      Meteor.call('s3bucket.put', result.clientId, 'photo', client.photo);
      Meteor.call('s3bucket.put', result.clientId, 'signature', client.signature);
    } catch (err) {
      logger.error('Failed to upload photo/signature to s3', err);
    }

    eventPublisher.publish(new ClientCreatedEvent(result, { userId: this.userId }));

    return result;
  },

  'clients.update'(clientId, client, schema) {
    logger.info(`METHOD[${Meteor.userId()}]: clients.update`, clientId, schema, client);
    check(clientId, String);
    check(schema, String);
    const hc = HmisClient.create(Meteor.userId());
    hc.api('client').updateClient(clientId, client, schema);

    eventPublisher.publish(new ClientUpdatedEvent({
      ...client,
      clientId,
      schema,
    }, { userId: this.userId }));

    return client;
  },

  'clients.delete'(clientId, schema) { // eslint-disable-line
    logger.info(`METHOD[${Meteor.userId()}]: clients.delete`, clientId);
    check(clientId, String);
    check(schema, String);
    const hc = HmisClient.create(Meteor.userId());
    hc.api('client').deleteClient(clientId, schema);
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('house-matching').updateClientMatchStatus(
      clientId, statusCode, comments, recipients
    );
  },

  searchClient(query, options) {
    logger.info(`METHOD[${Meteor.userId()}]: searchClient(${query})`);
    let { sort, order, limit } = options || {};
    const { page, excludeLocalClients } = options || {};
    sort = sort || 'firstName';
    order = order || 'asc';
    const startIndex = page * limit;

    // guard against client-side DOS: hard limit to 50
    limit = Math.min(50, Math.abs(limit || 50));

    const hc = HmisClient.create(Meteor.userId());
    let hmisClients = hc.api('client').searchClient(query, limit, startIndex, sort, order);

    hmisClients = hmisClients.filter(client => client.link);

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
        logger.warn(err);
      }

      // Removing entries where we have data coming from HMIS.
      for (let i = localClients.length - 1; i >= 0; i -= 1) {
        for (let j = 0; j < hmisClients.length; j += 1) {
          if (localClients[i].personalId === hmisClients[j].clientId) {
            // Remove.
            localClients.splice(i, 1);
            logger.info('Element Removed');
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
    const hc = HmisClient.create(this.userId);
    const clients = hc.api('client').getAllClients() || [];
    const clientBasics = clients.map(filterClientForCache);
    ClientsCache.rawCollection().insertMany(clientBasics, { ordered: false });
  },
});
