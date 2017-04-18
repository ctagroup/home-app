import moment from 'moment';
import { HmisClient } from '/imports/api/hmis-api';


Meteor.publish('client', function publishSingleClient(clientId, schema = 'v2015') {
  console.log('publishing client', clientId);

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

    try {
      const eligibleClient = hc.api('house-matching').getEligibleClient(clientId);
      client.eligibleClient = eligibleClient;
    } catch (err) {
      // do nothing
    }

    // TODO: move old api calls to the new one
    HMISAPI.setCurrentUserId(self.userId);

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

    client.enrollments = enrollments;

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

    client.globalHouseholds = globalHouseholds;

    // fetch client status
    const referralStatus = HMISAPI.getReferralStatusHistory(
      clientId
    );
    // Sort based on Timestamp
    referralStatus.sort((a, b) => {
      const aTime = moment(a.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
      const bTime = moment(b.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
      return aTime - bTime;
    });
    client.referralStatusHistory = referralStatus;

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

      client.housingMatch = housingMatch;
    }

    const matchingScore = HMISAPI.getClientScore(clientId);
    const score = parseInt(matchingScore.replace('score :', ''), 10);

    client.matchingScore = score;
  } catch (err) {
    logger.error('publish singleHMISClient', err);
  }

  if (client) {
    self.added('localClients', client.clientId, client);
  }
  return self.ready();
});
