import moment from 'moment';
import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';


Meteor.publish('client', function publishSingleClient(clientId, schema = 'v2015') {
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

    self.added('localClients', client.clientId, client);
    self.ready();

    Meteor.setTimeout(() => {
      let eligibleClient;
      try {
        eligibleClient = hc.api('house-matching').getEligibleClient(clientId);
      } catch (e) {
        eligibleClient = { error: e.details.code };
      }
      self.changed('localClients', client.clientId, { eligibleClient });
    }, 0);

    // TODO: move old api calls to the new one
    HMISAPI.setCurrentUserId(self.userId);

    Meteor.setTimeout(() => {
      let response = '';
      let enrollments = [];
      response = HMISAPI.getEnrollmentsForPublish(clientId, schema);
      enrollments = response.enrollments;

      for (let i = 1; (i * 30) < response.pagination.total && !stopFunction; i += 1) {
        const temp = HMISAPI.getEnrollmentsForPublish(clientId, schema, i * 30);
        enrollments.push(...temp.enrollments);
      }

      for (let i = 0; i < enrollments.length && !stopFunction; i += 1) {
        enrollments[i].exits = HMISAPI.getEnrollmentExitsForPublish(
          clientId,
          enrollments[i].enrollmentId,
          schema
        );

        if (enrollments[i].exits.length > 0) {
          enrollments[i].exits = enrollments[i].exits[0];
        } else {
          enrollments[i].exits = false;
        }

        enrollments[i].project = HMISAPI.getProjectForPublish(enrollments[i].projectid, schema);
      }

      self.changed('localClients', client.clientId, { enrollments });
    }, 0);

    Meteor.setTimeout(() => {
      let response = '';
      let globalHouseholdMemberships = [];
      response = HMISAPI.getGlobalHouseholdMembershipsForPublish(clientId);
      globalHouseholdMemberships = response.content;

      for (let i = 1; i < response.page.totalPages && !stopFunction; i += 1) {
        const temp = HMISAPI.getGlobalHouseholdMembershipsForPublish(clientId, i);
        globalHouseholdMemberships.push(...temp.content);
      }

      const globalHouseholds = [];
      for (let i = 0; i < globalHouseholdMemberships.length && !stopFunction; i += 1) {
        const globalHousehold = HMISAPI.getSingleGlobalHouseholdForPublish(
          globalHouseholdMemberships[i].globalHouseholdId
        );

        if (globalHousehold) {
          let hohSchema = 'v2015';
          if (globalHousehold.links[0].rel.indexOf('v2014') !== -1) {
            hohSchema = 'v2014';
          }

          globalHousehold.headOfHouseholdClient = HMISAPI.getClient(
            globalHousehold.headOfHouseholdId,
            hohSchema,
            // useCurrentUserObject
            false
          );
          globalHousehold.headOfHouseholdClient.schema = 'v2015';
          globalHousehold.userDetails = HMISAPI.getUserForPublish(
            globalHousehold.userId
          );

          globalHouseholds.push(globalHousehold);
        }
      }

      self.changed('localClients', client.clientId, { globalHouseholds });
    }, 0);

    Meteor.setTimeout(() => {
      // fetch client status
      const referralStatusHistory = HMISAPI.getReferralStatusHistory(clientId);

      // Sort based on Timestamp
      referralStatusHistory.sort((a, b) => {
        const aTime = moment(a.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
        const bTime = moment(b.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
        return aTime - bTime;
      });

      self.changed('localClients', client.clientId, { referralStatusHistory });
    }, 0);

    Meteor.setTimeout(() => {
      const housingMatch = HMISAPI.getSingleHousingMatchForPublish(clientId);

      if (housingMatch) {
        const housingUnit = HMISAPI.getHousingUnitForPublish(housingMatch.housingUnitId);

        let projectSchema = 'v2015';
        if (housingUnit.links && housingUnit.links.length > 0
          && housingUnit.links[0].rel.indexOf('v2014') !== -1) {
          projectSchema = 'v2014';
        }

        housingUnit.project = HMISAPI.getProjectForPublish(housingUnit.projectId, projectSchema);

        housingMatch.housingUnit = housingUnit;
      }
      self.changed('localClients', client.clientId, { housingMatch });
    }, 0);

    Meteor.setTimeout(() => {
      const matchingScore = hc.api('house-matching').getClientScore(clientId);
      self.changed('localClients', client.clientId, { matchingScore });
    }, 0);
  } catch (err) {
    logger.error('publish singleHMISClient', err);
  }

  return self.ready();
});
