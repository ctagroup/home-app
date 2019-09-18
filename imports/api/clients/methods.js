import moment from 'moment';
import { logger } from '/imports/utils/logger';
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

    logger.info(`METHOD[${this.userId}]: clients.create`, clientData);

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
      logger.error('Failed to upload photo/signature to s3', err);
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
        logger.error('Failed to create ROI for client', err);
      }
    }

    eventPublisher.publish(new ClientCreatedEvent(result, { userId: this.userId }));

    return result;
  },

  'clients.update'(clientId, client, schema) {
    const clientData = _.omit(client, 'photo', 'signature');
    logger.info(`METHOD[${this.userId}]: clients.update`, clientId, schema, clientData);

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
      logger.error('Failed to upload photo/signature to s3', err);
    }

    eventPublisher.publish(new ClientUpdatedEvent({
      ...clientData,
      clientId,
      schema,
    }, { userId: this.userId }));

    return client;
  },

  'clients.service'(clientId, data, schema) {
    logger.info(`METHOD[${this.userId}]: clients.service`, clientId, schema, data);
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
    logger.info(`METHOD[${this.userId}]: clients.delete`, clientId);

    check(clientId, String);
    check(schema, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    hc.api('client').deleteClient(clientId, schema);
  },

  'clients.updateMatchStatus'(clientId, statusCode, comments, recipients) {
    logger.info(`METHOD[${this.userId}]: clients.updateMatchStatus`,
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
    logger.info(`METHOD[${this.userId}]: searchClient(${query})`);
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

    logger.debug('search results', hmisClients.length);

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
  'caseNotes.list'(clientId) {
    check(clientId, String);
    const { noteApiClient } = this.context;
    return noteApiClient.getNotesForEntity(clientId, 'general');
  },
  'caseNotes.create'({ clientId, title, description }) {
    const { noteApiClient } = this.context;
    return noteApiClient.createNote({
      objectUuid: clientId,
      objectType: 'client',
      title,
      description,
    });
  },
  'caseNotes.update'({ id, title, description }) {
    const { noteApiClient } = this.context;
    return noteApiClient.updateNote(id, { title, description });
  },
  'caseNotes.delete'(id) {
    check(id, Number);
    const { noteApiClient } = this.context;
    return noteApiClient.deleteNote(id);
  },

  'matching.sendNoteByEmail'(title, body, recipients) {
    const { hmisClient } = this.context;
    check(title, String);
    check(body, String);
    check(recipients, [String]);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    recipients.forEach(recipient => {
      const email = {
        title,
        body,
        recipient,
      };
      const additionalInfo = {
        messageType: 'mathing note',
        recipientType: '',
        recipientId: '',
      };
      hmisClient.api('global').sendEmailNotification(email, additionalInfo);
    });
  },
  'matching.createNote'(matchId, step, note) {
    const { matchApiClient } = this.context;
    return matchApiClient.createNote(matchId, step, note);
  },
  'matching.updateNote'(noteId, note) {
    const { matchApiClient } = this.context;
    return matchApiClient.updateNote(noteId, note);
  },
  'matching.deleteNote'(noteId) {
    const { matchApiClient } = this.context;
    return matchApiClient.deleteNote(noteId);
  },
  'matching.createMatch'(clientId, projectId, startDate) {
    const { matchApiClient } = this.context;
    return matchApiClient.createHousingMatch(clientId, projectId, startDate);
  },
  'matching.addMatchHistory'(matchId, stepId, outcome) {
    const { matchApiClient } = this.context;
    return matchApiClient.createMatchHistory(matchId, stepId, outcome);
  },
  'matching.endMatch'(matchId, stepId, outcome) {
    const { matchApiClient } = this.context;
    matchApiClient.createMatchHistory(matchId, stepId, outcome);
    matchApiClient.matchPartialUpdate(matchId, {
      endDate: moment().format('YYYY-MM-DD'),
    });
  },
});
