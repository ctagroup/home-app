import { Clients } from './clients';

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
    const client = Clients.findOne({ _id: clientID });

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
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    const ret = HMISAPI.updateClientMatchStatus(clientId, statusCode, comments, recipients);
    if (!ret) {
      throw new Meteor.Error('Error updating client match status.');
    }
    return ret;
  },

});
