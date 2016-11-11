/**
 * Created by udit on 15/07/16.
 */

Meteor.publish('localClients', () => clients.find({}));

Meteor.publish('singleLocalClient', clientId => clients.find({ _id: clientId }));

Meteor.publish(
  'singleHMISClient', function publishSingleHMISClient(clientId, schema) {
    const self = this;
    let client = false;
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      client = HMISAPI.getClient(clientId, schema, false);
      client.schema = schema;

      let response = '';

      let enrollments = [];
      response = HMISAPI.getEnrollmentsForPublish(clientId, schema);
      enrollments = response.enrollments;

      for (let i = 1; (i * 30) < response.pagination.total; i += 1) {
        const temp = HMISAPI.getEnrollmentsForPublish(clientId, schema, i * 30);
        enrollments.push(...temp.enrollments);
      }

      for (let i = 0; i < enrollments.length; i += 1) {
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

      for (let i = 1; i < response.page.totalPages; i += 1) {
        const temp = HMISAPI.getGlobalHouseholdMembershipsForPublish(clientId, i);
        globalHouseholdMemberships.push(...temp.content);
      }

      const globalHouseholds = [];
      for (let i = 0; i < globalHouseholdMemberships.length; i += 1) {
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
          globalHousehold.userCreateDetails = HMISAPI.getUserForPublish(
            globalHousehold.userCreate
          );
          globalHousehold.userUpdateDetails = HMISAPI.getUserForPublish(
            globalHousehold.userUpdate
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
    } else {
      HMISAPI.setCurrentUserId('');
    }

    if (client) {
      self.added('clients', client.clientId, client);
    }
    return self.ready();
  }
);
