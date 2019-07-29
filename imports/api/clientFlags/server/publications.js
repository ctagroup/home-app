import { logger } from '/imports/utils/logger';
import { ClientFlags } from '../clientFlags';


Meteor.publish('clientFlags.all', function publishAllClientFlags(clientId) {
  logger.info(`PUB[${this.userId}]: clientFlags.all`);
  if (!this.userId) return [];
  if (!clientId) return [];
  // TODO: check permissions to get the data
  return ClientFlags.find({ dedupClientId: clientId }, { sort: { dateSet: -1 } });
});

Meteor.publish('clientFlags.one', function publishPendingClient(clientId) {
  logger.info(`PUB[${this.userId}]: clientFlags.one`);
  if (!this.userId) return [];
  // TODO: check permissions to get the data
  return ClientFlags.find({ dedupClientId: clientId }, { sort: { dateSet: -1 } });
});
