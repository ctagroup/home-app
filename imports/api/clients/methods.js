import { Clients } from './clients';
import { HmisClient } from '../hmis-api';

Meteor.methods({
  updateClient(clientId, client, schema = 'v2015') {
    if (this.isSimulation) {
      // client-side part
      return Clients.update(
        clientId, {
          $set: {
            firstName: client.firstName,
            middleName: client.middleName,
            lastName: client.lastName,
            suffix: client.suffix,
            emailAddress: client.emailAddress,
            phoneNumber: client.phoneNumber,
            photo: client.photo,
            ssn: client.ssn,
            dob: client.dob,
            race: client.race,
            ethnicity: client.ethnicity,
            gender: client.gender,
            veteranStatus: client.veteranStatus,
            disablingConditions: client.disablingConditions,
          },
        }
      );
    }

    // server-side part
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('client').updateClient(clientId, client, schema);
  },

  removeClient(clientId) { // eslint-disable-line
    // should we remove client from hmis to pending collection?
    throw new Meteor.Error('500', 'Removing client is not yet implemented');
    // Clients.remove({ _id: clientId });
  },

  updateClientMatchStatus(clientId, statusCode, comments, recipients) {
    const ret = HMISAPI.updateClientMatchStatus(clientId, statusCode, comments, recipients);
    if (!ret) {
      throw new Meteor.Error('Error updating client match status.');
    }
    return ret;
  },

});
