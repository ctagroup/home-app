import { PendingClients } from './pending-clients';
import { HmisClient } from '/imports/api/hmis-api';

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


});
