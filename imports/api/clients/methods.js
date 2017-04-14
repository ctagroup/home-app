import { Clients } from './clients';
import { HmisClient } from '../hmis-api';

Meteor.methods({
  addClient(
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
    const client = Clients.insert(
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
  updateClient(
    clientId,
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
    disablingConditions
  ) {
    Clients.update(
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

  removeClient(clientId) {
    Clients.remove({ _id: clientId });
  },

  addClientToHMIS(clientId) {
    check(clientId, String);

    const client = Clients.findOne(clientId);

    if (!client) {
      throw new Meteor.Error('404', `Client ${clientId} not found`);
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
      Clients.remove({ _id: clientId });

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
      };
      responses.update({ clientId },
        { $set: { clientID: personalId, clientSchema: 'v2015', isHMISClient: true } },
        { multi: true }
      );
    }
    return result;
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    const ret = HMISAPI.updateClientMatchStatus(clientId, statusCode, comments, recipients);
    if (!ret) {
      throw new Meteor.Error('Error updating client match status.');
    }
    return ret;
  },

});
