import { logger } from '/imports/utils/logger';
import { ClientsAccessRoles } from '/imports/config/permissions';
import { PendingClients } from '../pendingClients';


Meteor.publish('pendingClients.all', function publishAllPendingClients() {
  logger.info(`PUB[${this.userId}]: pendingClients.all`);
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }
  return PendingClients.find();
});

Meteor.publish('pendingClients.one', function publishPendingClient(clientId) {
  logger.info(`PUB[${this.userId}]: pendingClients.one`);
  check(clientId, String);
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }
  return PendingClients.find({ _id: clientId });
});
