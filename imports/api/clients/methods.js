import moment from 'moment';
import { logger } from '/imports/utils/logger';
import { ClientsAccessRoles } from '/imports/config/permissions';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { ClientsCache } from '/imports/api/clients/clientsCache';
import { HmisClient } from '/imports/api/hmisApi';
import { mergeByDedupId, filterClientForCache } from '/imports/api/clients/helpers';
import eventPublisher, {
  UserEvent,
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
      if (client.photo) {
        Meteor.call('s3bucket.put', result.dedupClientId, 'photo', client.photo);
      }
      if (client.signature) {
        Meteor.call('s3bucket.put', result.dedupClientId, 'signature', client.signature);
      }
    } catch (err) {
      logger.error('Failed to upload photo/signature to s3', err);
    }

    eventPublisher.publish(new UserEvent(
      'clients.create',
      `id=${result.clientId} schema=${result.schema} dedupClientId=${result.dedupClientId}`,
      { userId: this.userId }
    ));

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

    eventPublisher.publish(new UserEvent(
      'clients.update',
      `id=${clientId} schema=${schema}`,
      { userId: this.userId, clientData, clientId, schema }
    ));

    return client;
  },

  'clients.service'(clientId, data, schema) {
    logger.info(`METHOD[${this.userId}]: clients.service`, clientId, schema, data);
    check(clientId, String);
    check(schema, String);
    const hc = HmisClient.create(this.userId);
    // TODO: security add role check
    hc.api('client').updateClient(clientId, data, schema);

    eventPublisher.publish(new UserEvent(
      'clients.service',
      `id=${clientId} schema=${schema}`,
      { userId: this.userId, data, clientId, schema }
    ));
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

    eventPublisher.publish(new UserEvent(
      'clients.delete',
      `id=${clientId} schema=${schema}`,
      { userId: this.userId, clientId, schema }
    ));
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
    const result = hc.api('house-matching').updateClientMatchStatus(
      clientId, statusCode, comments, recipients
    );

    eventPublisher.publish(new UserEvent(
      'clients.updateMatchStatus',
      `id=${clientId} statusCode=${statusCode}`,
      { userId: this.userId, comments, recipients }
    ));

    return result;
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
    const result = noteApiClient.createNote({
      objectUuid: clientId,
      objectType: 'client',
      title,
      description,
    });

    eventPublisher.publish(new UserEvent(
      'caseNotes.create',
      `${clientId} ${title}`,
      { userId: this.userId, result }
    ));

    return result;
  },
  'caseNotes.update'({ id, title, description }) {
    const { noteApiClient } = this.context;
    const result = noteApiClient.updateNote(id, { title, description });

    eventPublisher.publish(new UserEvent(
      'caseNotes.update',
      `${id} ${title}`,
      { userId: this.userId, result }
    ));

    return result;
  },

  'caseNotes.delete'(id) {
    check(id, Number);
    const { noteApiClient } = this.context;
    const result = noteApiClient.deleteNote(id);

    eventPublisher.publish(new UserEvent(
      'caseNotes.delete',
      `${id}`,
      { userId: this.userId }
    ));

    return result;
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
    eventPublisher.publish(new UserEvent(
      'matching.sendNoteByEmail',
      `${title}`,
      { userId: this.userId, body, recipients }
    ));
  },

  'matching.createNote'(matchId, step, note) {
    const { matchApiClient } = this.context;
    const result = matchApiClient.createNote(matchId, step, note);
    eventPublisher.publish(new UserEvent(
      'matching.createNote',
      `${matchId} ${step} ${note}`,
      { userId: this.userId }
    ));
    return result;
  },

  'matching.updateNote'(noteId, note) {
    const { matchApiClient } = this.context;
    const result = matchApiClient.updateNote(noteId, note);
    eventPublisher.publish(new UserEvent(
      'matching.updateNote',
      `${noteId} ${note}`,
      { userId: this.userId }
    ));
    return result;
  },

  'matching.deleteNote'(noteId) {
    const { matchApiClient } = this.context;
    const result = matchApiClient.deleteNote(noteId);
    eventPublisher.publish(new UserEvent(
      'matching.deleteNote',
      `${noteId}`,
      { userId: this.userId }
    ));
    return result;
  },

  'matching.createMatch'(clientId, projectId, startDate) {
    const { matchApiClient } = this.context;
    const result = matchApiClient.createHousingMatch(clientId, projectId, startDate);
    eventPublisher.publish(new UserEvent(
      'matching.createMatch',
      `clientId=${clientId} projectId=${projectId} ${startDate}`,
      { userId: this.userId }
    ));
    return result;
  },

  'matching.addMatchHistory'(matchId, stepId, outcome) {
    const { matchApiClient } = this.context;
    const result = matchApiClient.createMatchHistory(matchId, stepId, outcome);
    eventPublisher.publish(new UserEvent(
      'matching.addMatchHistory',
      `${matchId} ${stepId} ${outcome}`,
      { userId: this.userId }
    ));
    return result;
  },

  'matching.endMatch'(matchId, stepId, outcome) {
    const { matchApiClient } = this.context;
    matchApiClient.createMatchHistory(matchId, stepId, outcome);
    matchApiClient.matchPartialUpdate(matchId, {
      endDate: moment().format('YYYY-MM-DD'),
    });
    eventPublisher.publish(new UserEvent(
      'matching.endMatch',
      `${matchId} ${stepId} ${outcome}`,
      { userId: this.userId }
    ));
  },
});
