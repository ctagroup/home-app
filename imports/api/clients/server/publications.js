import { eachLimit } from 'async';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import Agencies from '/imports/api/agencies/agencies';
import Users from '/imports/api/users/users';
import {
  sortByTime,
  mergeClient,
  getEligibleClient,
  getClientEnrollments,
  getGlobalHouseholds,
  getReferralStatusHistory,
  getHousingMatch,
} from '/imports/api/clients/helpers';
import {
  anyValidConsent,
  filterClientProfileFields,
} from '/imports/api/consents/helpers';


Meteor.publish('clients.one',
function pubClient(inputClientId, inputSchema = 'v2015', loadDetails = true) {
  logger.info(`PUB[${this.userId}]: clients.one(${inputClientId}, ${inputSchema})`);
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions to get the data
  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => {
    stopFunction = true;
  });

  let client = false;

  try {
    const user = Users.findOne(this.userId);
    const hc = HmisClient.create(this.userId);
    client = hc.api('client').getClient(inputClientId, inputSchema);
    client.schema = inputSchema;
    client.isHMISClient = true;
    // TODO [VK]: publish by dedupClientId directly
    const clientVersions = hc.api('client').searchClient(client.dedupClientId, 50);

    let consents = [];
    try {
      consents = hc.api('global').getClientConsents(client.dedupClientId);
    } catch (err) {
      logger.error('Error loading consents:', err);
      client.consentErrorMessage = err;
    }

    const projects = Agencies.getProjectsWithinCurrentlySelectedConsentGroup(user);
    if (!anyValidConsent(consents, projects)) {
      logger.debug('consent rejected');
      client.consentIsGranted = false;
      self.added('localClients', inputClientId, filterClientProfileFields(client));
      return self.ready();
    }
    logger.debug('consent granted');

    const mergedClient = mergeClient(clientVersions);
    mergeClient.consentIsGranted = true;
    self.added('localClients', inputClientId, {
      ...mergedClient,
      consentIsGranted: true,
      consents,
    });
    self.ready();

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

      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            try {
              const key = `photo::${schema}::${clientId}`;
              Meteor.call('s3bucket.get', inputClientId, 'photo', (err, res) => {
                if (!err && res) {
                  self.changed('localClients', inputClientId, { [key]: res });
                  self.changed('localClients', inputClientId, { photo: res });
                }
                return null;
              });
            } catch (e) {
              logger.warn(e);
            } // eslint-disable-line
            callback();
          });
        });
      eachLimit(mergedClient.clientVersions, Meteor.settings.connectionLimit,
        ({ schema, clientId }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            try {
              const key = `signature::${schema}::${clientId}`;
              Meteor.call('s3bucket.get', inputClientId, 'signature', (err, res) => {
                if (!err && res) {
                  self.changed('localClients', inputClientId, { [key]: res });
                  self.changed('localClients', inputClientId, { signature: res });
                }
                return null;
              });
            } catch (e) {
              logger.warn(e);
            } // eslint-disable-line
            callback();
          });
        });
    }
  } catch (err) {
    logger.error('publish singleHMISClient', err);
  }

  self.ready();

  return null;
});
