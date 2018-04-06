import { logger } from '/imports/utils/logger';
import { PendingClients } from '../pendingClients';


Meteor.publish('pendingClients.all', function publishAllPendingClients() {
  logger.info(`PUB[${this.userId}]: pendingClients.all`);
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions to get the data
  return PendingClients.find();
});

Meteor.publish('pendingClients.one', function publishPendingClient(clientId) {
  logger.info(`PUB[${this.userId}]: pendingClients.one`);
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions to get the data
  return PendingClients.find({ _id: clientId });
});
