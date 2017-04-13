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
    clientID,
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
      clientID, {
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

  removeClient(clientID) {
    Clients.remove({ _id: clientID });
  },

  addClientToHMIS(clientID) {
    check(clientID, String);

    const client = Clients.findOne({ _id: clientID });

    const c = HmisClient.create(Meteor.userId());

    const personalId = c.api('client').createClient(client);

    let flag = false;

    /*
     Old api redirected to this link after success:
     https://home.ctagroup.org/clients/9b60cb11-5c3a-4d5b-942d-90dde4d5dc63?addedToHMIS=1&isHMISClient=true&link=%2Fhmis-clientapi%2Frest%2Fv2015%2Fclients%2F%2F9b60cb11-5c3a-4d5b-942d-90dde4d5dc63&schema=v2015
     */

    if (personalId) {
      // Clients.remove({ _id: client._id });
      const clientBasePath = HomeConfig.hmisAPIEndpoints.clientBaseUrl.replace(
        HomeConfig.hmisAPIEndpoints.apiBaseUrl,
        ''
      );
      const schemaVersion = HomeConfig.hmisAPIEndpoints.v2015;
      const clientsPath = HomeConfig.hmisAPIEndpoints.clients;
      const url = `${clientBasePath}${schemaVersion}${clientsPath}/${personalId}`;
      flag = {
        _id: personalId,
        link: url,
      };
      logger.debug(flag);
      /*
      responses.update({ clientID },
        { $set: { clientID: flag._id, clientSchema: 'v2015', isHMISClient: true } },
        { multi: true }
      );
      */
    }

    throw new Meteor.Error('not impl', 'Method not yet implemented');

    /*
    const personalId = HMISAPI.createClient(client);

    let flag = false;

    if (personalId) {
      Clients.remove({ _id: client._id });
      const clientBasePath = HomeConfig.hmisAPIEndpoints.clientBaseUrl.replace(
        HomeConfig.hmisAPIEndpoints.apiBaseUrl,
        ''
      );
      const schemaVersion = HomeConfig.hmisAPIEndpoints.v2015;
      const clientsPath = HomeConfig.hmisAPIEndpoints.clients;
      const url = `${clientBasePath}${schemaVersion}${clientsPath}/${personalId}`;
      flag = {
        _id: personalId,
        link: url,
      };

      responses.update({ clientID },
        { $set: { clientID: flag._id, clientSchema: 'v2015', isHMISClient: true } },
        { multi: true }
      );
    }
     return flag;
    */
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    const ret = HMISAPI.updateClientMatchStatus(clientId, statusCode, comments, recipients);
    if (!ret) {
      throw new Meteor.Error('Error updating client match status.');
    }
    return ret;
  },

});
