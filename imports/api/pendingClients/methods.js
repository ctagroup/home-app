import { PendingClients } from './pendingClients';
import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';
import Responses from '/imports/api/responses/responses';


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
    logger.info(`METHOD[${Meteor.userId()}]: addPendingClient`);

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
    logger.info(`METHOD[${Meteor.userId()}]: updatePendingClient`, clientId, client);

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
    logger.info(`METHOD[${Meteor.userId()}]: removePendingClient`, clientId);
    // TODO: check permissions
    if (!PendingClients.findOne(clientId)) {
      throw new Meteor.Error('404', 'Pending client not found');
    }
    PendingClients.remove({ _id: clientId });
  },

  uploadPendingClientToHmis(clientId, schema) {
    logger.info(`METHOD[${Meteor.userId()}]: uploadPendingClientToHmis`, clientId);
    check(clientId, String);

    const client = PendingClients.findOne(clientId);

    if (!client) {
      throw new Meteor.Error('404', `Pending client ${clientId} not found`);
    }

    const hc = HmisClient.create(Meteor.userId());
    const personalId = hc.api('client').createClient(client, schema);

    logger.info(`client ${clientId} is now known in HMIS as ${personalId}`);

    if (personalId) {
      PendingClients.remove(clientId);
      Responses.update({ clientID: clientId },
        { $set: { clientID: personalId, clientSchema: 'v2015', isHMISClient: true } },
        { multi: true }
      );
    }
    return personalId;
  },
});
