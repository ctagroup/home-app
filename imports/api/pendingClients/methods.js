import { PendingClients } from './pendingClients';
import { ClientsAccessRoles } from '/imports/config/permissions';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import Responses from '/imports/api/responses/responses';


Meteor.methods({
  'pendingClients.create'(client) {
    logger.info(`METHOD[${this.userId}]: pendingClients.create`, client);
    check(client, PendingClients.schema);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    return PendingClients.insert(client);
  },

  'pendingClients.update'(clientId, client) {
    logger.info(`METHOD[${this.userId}]: updatePendingClient`, clientId, client);


    check(clientId, String);
    check(client, PendingClients.schema);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

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

  'pendingClients.delete'(clientId) {
    logger.info(`METHOD[${this.userId}]: removePendingClient`, clientId);
    check(clientId, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    if (!PendingClients.findOne(clientId)) {
      throw new Meteor.Error('404', 'Pending client not found');
    }
    PendingClients.remove({ _id: clientId });
  },

  uploadPendingClientToHmis(clientId, schema = 'v2017') {
    logger.info(`METHOD[${this.userId}]: uploadPendingClientToHmis`, clientId, schema);
    check(clientId, String);
    check(schema, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const client = PendingClients.findOne(clientId);

    if (!client) {
      throw new Meteor.Error('404', `Pending client ${clientId} not found`);
    }

    const hc = HmisClient.create(this.userId);
    const response = hc.api('client').createClient(client, schema);
    logger.info(`client ${clientId} is now known in HMIS as ${response.clientId}`);

    try {
      Meteor.call('s3bucket.put', response.clientId, 'photo', client.photo);
      Meteor.call('s3bucket.put', response.clientId, 'signature', client.signature);
    } catch (err) {
      logger.error('Failed to upload photo/signature to s3', err);
    }

    if (response.clientId) {
      PendingClients.remove(clientId);
      Responses.update({ clientId },
        { $set: { clientId: response.clientId, clientSchema: schema } },
        { multi: true }
      );
    }
    return {
      clientId: response.clientId,
      schema,
    };
  },
});
