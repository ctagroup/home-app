import { eachLimit } from 'async';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import {
  sortByTime,
  // mergeClient,
  mergeClientExtended,
  getEligibleClient,
  getClientEnrollments,
  getGlobalHouseholds,
  getReferralStatusHistory,
  getHousingMatch,
  filterClientForCache,
} from '/imports/api/clients/helpers';
import { ClientsCache } from '/imports/api/clients/clientsCache';

Meteor.publish('clients.one',
function pubClient(inputClientId, inputSchema = 'v2015', loadDetails = true) {
  logger.info(`PUB[${this.userId}]: clients.one(${inputClientId}, ${inputSchema})`);
  if (!this.userId) return [];
  // TODO: check permissions to get the data
  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => {
    stopFunction = true;
  });

  let client = false;
  try {
    const hc = HmisClient.create(this.userId);
    client = hc.api('client').getClient(inputClientId, inputSchema);
    client.schema = inputSchema;
    client.isHMISClient = true;

    // TODO [VK]: publish by dedupClientId directly
    // NOTE [PG]: it's currently not possible because not all clients have dedupId :(
    let clientVersions = [client];
    if (client.dedupClientId) {
      clientVersions = hc.api('client').searchClient(client.dedupClientId);
    }

    // const mergedClient = mergeClient(clientVersions, inputSchema);
    const mergedClient = mergeClientExtended(
      _.uniq([client].concat(clientVersions), (i) => i.clientId), inputSchema);
    self.added('localClients', inputClientId, mergedClient);
    self.ready();

    logger.debug(mergedClient);

    let mergedReferralStatusHistory = [];
    let mergedHousingMatch = {};
    let mergedMatchingScore = 0;

    if (loadDetails) {
      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            const eligibleClient = getEligibleClient(hc, clientId);
            const key = `eligibleClient::${schema}::${clientId}`;
            self.changed('localClients', inputClientId, { [key]: eligibleClient });
            callback();
          });
        });

      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            try {
              const enrollments =
                getClientEnrollments(hc, clientId, schema, stopFunction);
              const key = `enrollments::${schema}::${clientId}`;
              self.changed('localClients', inputClientId, { [key]: enrollments });
            } catch (e) {
              logger.warn(e);
            }
            callback();
          });
        });

      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            const globalHouseholds =
              getGlobalHouseholds(hc, clientId, schema, stopFunction);
            const key = `globalHouseholds::${schema}::${clientId}`;
            self.changed('localClients', inputClientId, { [key]: globalHouseholds });
            callback();
          });
        });

      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            // fetch client status
            try {
              const referralStatusHistory = getReferralStatusHistory(hc, clientId);
              // self.changed('localClients', inputClientId,
              //   { { clientId/schema } : referralStatusHistory });
              const key = `referralStatusHistory::${schema}::${clientId}`;
              self.changed('localClients', inputClientId, { [key]: referralStatusHistory });
              mergedReferralStatusHistory =
                mergedReferralStatusHistory.concat(referralStatusHistory);
              self.changed('localClients', inputClientId, { referralStatusHistory:
                sortByTime(mergedReferralStatusHistory) });
            } catch (e) {
              logger.warn(e);
            }
            callback();
          });
        });

      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            try {
              const housingMatch = getHousingMatch(hc, clientId);
              const key = `housingMatch::${schema}::${clientId}`;
              self.changed('localClients', inputClientId, { [key]: housingMatch });
              mergedHousingMatch = Object.assign(mergedHousingMatch, housingMatch);
              self.changed('localClients', inputClientId, { housingMatch: mergedHousingMatch });
            } catch (e) {
              logger.warn(e);
            }
            callback();
          });
        });

      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            try {
              const matchingScore = hc.api('house-matching').getClientScore(clientId);
              const key = `matchingScore::${schema}::${clientId}`;
              self.changed('localClients', inputClientId, { [key]: matchingScore });
              mergedMatchingScore = Math.max(mergedMatchingScore, matchingScore);
              self.changed('localClients', inputClientId, { matchingScore: mergedMatchingScore });
            } catch (e) {
              logger.warn(e);
            }
            callback();
          });
        });
    }
  } catch (err) {
    logger.error('publish singleHMISClient', err);
  }

  self.ready();

  try {
    // try to load photo using dedup id
    Meteor.call('s3bucket.get', client.dedupClientId, 'photo', (err, res) => {
      if (err) {
        Meteor.call('s3bucket.get', inputClientId, 'photo', (err2, res2) => {
          // try to load photo using client id
          if (res2) {
            self.changed('localClients', inputClientId, { photo: res2 });
          }
        });
      } else {
        self.changed('localClients', inputClientId, { photo: res });
      }
    }
    );
  } catch (e) {} // eslint-disable-line

  return null;
});

Meteor.publish('clients.all', function pubClients(force = false) {
  logger.info(`PUB[${this.userId}]: clients.all`);

  let stopFunction = false;
  this.unblock();
  this.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);
  try {
    const cachedClients = ClientsCache.find().fetch();
    if (cachedClients.length && !force) {
      cachedClients.forEach(client => { this.added('localClients', client.clientId, client); });
    } else {
      const clients = hc.api('client').getAllClients() || [];
      const clientBasics = clients.map(client => {
        if (stopFunction) return null;
        this.added('localClients', client.clientId, client);
        this.ready();
        return filterClientForCache(client);
        // return {
        //   clientId: client.clientId,
        //   dedupClientId: client.dedupClientId,
        //   firstName: client.firstName,
        //   middleName: client.middleName,
        //   lastName: client.lastName,
        //   dob: client.dob,
        // };
      }).filter(c => c);
      // ClientsCache.updateMany({}, { upsert: true });
      ClientsCache.rawCollection().insertMany(clientBasics, { ordered: false });
    }
  } catch (e) {
    logger.warn(e);
  }
  return this.ready();
});
