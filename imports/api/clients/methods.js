import { PendingClients } from './pending-clients';
import { HmisClient } from '../hmis-api';

Meteor.methods({
  addPendingClient(
    firstName,
    middleName,
    lastName,
    suffix,
    emailAddress,
    phoneNumber,
    photo,
    ssn,
    dob,
    race,
    ethnicity,
    gender,
    veteranStatus,
    disablingConditions,
    signature
  ) {
    // TODO: check permissions

    const client = PendingClients.insert(
      {
        firstName,
        middleName,
        lastName,
        suffix,
        emailAddress,
        phoneNumber,
        photo,
        ssn,
        dob,
        race,
        ethnicity,
        gender,
        veteranStatus,
        disablingConditions,
        signature,
      }
    );
    return client;
  },

  updatePendingClient(clientId, client) {
    // TODO: check permissions

    if (!PendingClients.findOne(clientId)) {
      throw new Meteor.Error('404', 'Pending client not found');
    }

    const {
      firstName, middleName, lastName, suffix, emailAddress,
      phoneNumber, photo, ssn, dob, race, ethnicity, gender,
      veteranStatus, disablingConditions,
    } = client;

    PendingClients.update(
      clientId, {
        $set: {
          firstName,
          middleName,
          lastName,
          suffix,
          emailAddress,
          phoneNumber,
          photo,
          ssn,
          dob,
          race,
          ethnicity,
          gender,
          veteranStatus,
          disablingConditions,
        },
      }
    );
  },

  removePendingClient(clientId) {
    // TODO: check permissions
    if (!PendingClients.findOne(clientId)) {
      throw new Meteor.Error('404', 'Pending client not found');
    }
    PendingClients.remove({ _id: clientId });
  },

  uploadPendingClientToHmis(clientId) {
    check(clientId, String);

    const client = PendingClients.findOne(clientId);

    if (!client) {
      throw new Meteor.Error('404', `Pending client ${clientId} not found`);
    }

    const hc = HmisClient.create(Meteor.userId());
    const personalId = hc.api('client').createClient(client);

    logger.info(`client ${clientId} is now known as ${personalId}`);
    /*
     Old api redirected to this link after success:
     https://home.ctagroup.org/clients/9b60cb11-5c3a-4d5b-942d-90dde4d5dc63?addedToHMIS=1&isHMISClient=true&link=%2Fhmis-clientapi%2Frest%2Fv2015%2Fclients%2F%2F9b60cb11-5c3a-4d5b-942d-90dde4d5dc63&schema=v2015
    */

    let result = false;

    if (personalId) {
      PendingClients.remove({ _id: clientId });

      // TODO: use new API
      const clientBasePath = HomeConfig.hmisAPIEndpoints.clientBaseUrl.replace(
        HomeConfig.hmisAPIEndpoints.apiBaseUrl,
        ''
      );
      const schemaVersion = HomeConfig.hmisAPIEndpoints.v2015;
      const clientsPath = HomeConfig.hmisAPIEndpoints.clients;
      const url = `${clientBasePath}${schemaVersion}${clientsPath}/${personalId}`;
      result = {
        _id: personalId,
        link: url,
        deletedId: clientId,
      };
      responses.update({ clientId },
        { $set: { clientID: personalId, clientSchema: 'v2015', isHMISClient: true } },
        { multi: true }
      );
    }
    return result;
  },

  getClient(clientId, schema = 'v2015') {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Not authorized');
    }

    // TODO: check permissions to get the data
    const self = this;
    self.unblock();

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
    return client;
  },

  updateClient(clientId, client) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Not authorized');
    }

    // TODO: check permissions to get the data

    const hc = HmisClient.create(this.userId);
    hc.api('client').updateClient(clientId, client);
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    // TODO: check permissions
    // TODO: use new API
    const ret = HMISAPI.updateClientMatchStatus(clientId, statusCode, comments, recipients);
    if (!ret) {
      throw new Meteor.Error('Error updating client match status.');
    }
    return ret;
  },

});
