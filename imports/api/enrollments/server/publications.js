import { eachLimit } from 'async';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import {
  getClientGlobalEnrollments,
} from '/imports/api/enrollments/helpers';


Meteor.publish('enrollments.one', function publishEnrollment(clientId, schema, enrollmentId) {
  logger.info(`PUB[${this.userId}]: enrollments.one`, clientId, schema, enrollmentId);
  if (!this.userId) return [];

  try {
    const hc = HmisClient.create(this.userId);
    const enrollment = hc.api('client').debug().getClientEnrollment(clientId, schema, enrollmentId);
    logger.debug(enrollment);
    this.added('enrollments', enrollment.enrollmentId, enrollment);
  } catch (err) {
    logger.error('enrollments.one', err);
  }

  return this.ready();
});

Meteor.publish('client.globalEnrollments',
function pubClient(dedupClientId, inputSchema = 'v2015', loadDetails = false) {
  logger.info(`PUB[${this.userId}]: clients.one(${dedupClientId}, ${inputSchema})`);
  if (!this.userId) return [];
  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => { stopFunction = true; });

  try {
    const hc = HmisClient.create(this.userId);

    const globalEnrollments = getClientGlobalEnrollments(hc, dedupClientId, stopFunction);

    self.added('globalEnrollments', dedupClientId, globalEnrollments);
    self.ready();

    if (loadDetails) {
      eachLimit(globalEnrollments, Meteor.settings.connectionLimit,
        ({ enrollments: { enrollments } }, callback) => {
          if (stopFunction) { callback(); return; }
          Meteor.defer(() => {
            // const eligibleClient = getEligibleClient(hc, clientId);
            // const key = `eligibleClient::${schema}::${clientId}`;
            // self.changed('localClients', inputClientId, { [key]: eligibleClient });
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
