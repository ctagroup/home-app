import { eachLimit } from 'async';
import { HmisClient } from '/imports/api/hmisApi';
import { ClientsAccessRoles } from '/imports/config/permissions';
import {
  getClientGlobalEnrollments,
} from '/imports/api/enrollments/helpers';


Meteor.injectedPublish('enrollments.one',
function publishEnrollment(clientId, schema, enrollmentId, dataCollectionStage) {
  const { logger, enrollmentsRepository } = this.context;
  logger.info(`PUB[${this.userId}]: enrollments.one`,
    clientId, schema, enrollmentId, dataCollectionStage
  );
  check(clientId, String);
  check(schema, String);
  check(enrollmentId, String);
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }

  try {
    const enrollment = enrollmentsRepository.getClientEnrollment(
      clientId, schema, enrollmentId, dataCollectionStage
    );
    this.added('enrollments', enrollment.enrollmentId, enrollment);
  } catch (err) {
    logger.error('enrollments.one', err);
  }

  return this.ready();
});

Meteor.injectedPublish('client.globalEnrollments',
function pubClient(dedupClientId, inputSchema = 'v2015', loadDetails = false) {
  const { logger } = this.context;
  logger.info(`PUB[${this.userId}]: clients.one(${dedupClientId}, ${inputSchema})`);
  check(dedupClientId, String);
  check(inputSchema, String);
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }

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
  return self.ready();
});
