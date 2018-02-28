import moment from 'moment';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import { mergeClient } from '/imports/api/clients/helpers';

const getEligibleClient = (hc, clientId) => {
  let eligibleClient;
  try {
    eligibleClient = hc.api('house-matching').getEligibleClient(clientId);
  } catch (e) {
    eligibleClient = { error: e.reason };
  }
  return eligibleClient;
};

const getClientEnrollments = (hc, clientId, schema, stopFunction) => {
  const enrollments = hc.api('client').getClientEnrollments(clientId, schema);
  for (let i = 0; i < enrollments.length && !stopFunction; i += 1) {
    const exits = hc.api('client').getClientsEnrollmentExits(
      clientId, enrollments[i].enrollmentId, schema
    );
    if (exits.length > 0) {
      enrollments[i].exits = exits[0];
    } else {
      enrollments[i].exits = false;
    }
    enrollments[i].project = hc.api('client').getProject(enrollments[i].projectid, schema);
  }
  return enrollments;
};

const getGlobalHouseholds = (hc, clientId, schema, stopFunction) => {
  const globalHouseholdMemberships = hc.api('global-household')
  .getGlobalHouseholdMemberships(clientId);

  const globalHouseholds = [];
  for (let i = 0; i < globalHouseholdMemberships.length && !stopFunction; i += 1) {
    const globalHousehold = hc.api('global-household').getHouseHold(
      globalHouseholdMemberships[i].globalHouseholdId
    );

    if (globalHousehold) {
      let hohSchema = 'v2015';
      if (globalHousehold.links[0].rel.indexOf('v2014') !== -1) {
        hohSchema = 'v2014';
      }

      globalHousehold.headOfHouseholdClient = hc.api('client').getClient(
        globalHousehold.headOfHouseholdId,
        hohSchema
      );
      globalHousehold.headOfHouseholdClient.schema = 'v2015';
      globalHousehold.userDetails = hc.api('user-service').getUser(
        globalHousehold.userId
      );

      globalHouseholds.push(globalHousehold);
    }
  }
  return globalHouseholds;
};

const getReferralStatusHistory = (hc, clientId) => {
  const referralStatusHistory = hc.api('house-matching').getReferralStatusHistory(clientId);
  // Sort based on Timestamp
  referralStatusHistory.sort((a, b) => {
    const aTime = moment(a.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
    const bTime = moment(b.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
    return aTime - bTime;
  });
};

const getHousingMatch = (hc, clientId) => {
  const housingMatch = hc.api('house-matching').getHousingMatch(clientId);
  const housingUnit = hc.api('housing').getHousingUnit(housingMatch.housingUnitId);
  let projectSchema = 'v2015';
  if (housingUnit.links && housingUnit.links.length > 0
    && housingUnit.links[0].rel.indexOf('v2014') !== -1) {
    projectSchema = 'v2014';
  }
  housingUnit.project = hc.api('client').getProject(housingUnit.projectId, projectSchema);
  housingMatch.housingUnit = housingUnit;
  return housingMatch;
};

Meteor.publish('clients.one', function pubClient(clientId, schema = 'v2015', loadDetails = true) {
  logger.info(`PUB[${this.userId}]: clients.one(${clientId}, ${schema})`);
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
    const hc = HmisClient.create(this.userId);
    client = hc.api('client').getClient(clientId, schema);
    client.schema = schema;
    client.isHMISClient = true;
    // TODO [VK]: publish by dedupClientId directly
    const clientVersions = hc.api('client').searchClient(client.dedupClientId, 50);

    self.added('localClients', clientId, mergeClient(clientVersions));
    self.ready();

    if (loadDetails) {
      Meteor.setTimeout(() => {
        const eligibleClient = getEligibleClient(hc, clientId);
        self.changed('localClients', clientId, { eligibleClient });
      }, 0);

      Meteor.setTimeout(() => {
        try {
          const enrollments = getClientEnrollments(hc, clientId, schema, stopFunction);
          self.changed('localClients', clientId, { enrollments });
        } catch (e) {
          logger.warn(e);
        }
      }, 0);

      Meteor.setTimeout(() => {
        const globalHouseholds = getGlobalHouseholds(hc, clientId, schema, stopFunction);
        self.changed('localClients', clientId, { globalHouseholds });
      }, 0);

      Meteor.setTimeout(() => {
        // fetch client status
        try {
          const referralStatusHistory = getReferralStatusHistory(hc, clientId);
          self.changed('localClients', clientId, { referralStatusHistory });
        } catch (e) {
          logger.warn(e);
        }
      }, 0);

      Meteor.setTimeout(() => {
        try {
          const housingMatch = getHousingMatch(hc, clientId);
          self.changed('localClients', clientId, { housingMatch });
        } catch (e) {
          logger.warn(e);
        }
      }, 0);

      Meteor.setTimeout(() => {
        try {
          const matchingScore = hc.api('house-matching').getClientScore(clientId);
          self.changed('localClients', clientId, { matchingScore });
        } catch (e) {
          logger.warn(e);
        }
      }, 0);
    }
  } catch (err) {
    logger.error('publish singleHMISClient', err);
  }

  self.ready();

  try {
    Meteor.call('s3bucket.get', clientId, 'photo', (err, res) =>
      self.changed('localClients', clientId, { photo: res })
    );
  } catch (e) {} // eslint-disable-line

  return null;
});
