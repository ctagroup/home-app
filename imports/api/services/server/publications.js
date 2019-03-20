import { logger } from '/imports/utils/logger';
import Services from '/imports/api/services/services';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.publish('services.perClient', function publishClientServices(clientId) {
  logger.info(`PUB[${this.userId}]: services.perClient`, clientId);
  if (!this.userId) {
    return [];
  }
  return Services.find({ clientId });
});
