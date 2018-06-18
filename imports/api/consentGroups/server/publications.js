import { logger } from '/imports/utils/logger';
import ConsentGroups from '../consentGroups';


Meteor.publish('consentGroups.all', function publishConsentGroups() {
  logger.info(`PUB[${this.userId}]: consentGroups.all`);
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions
  Meteor.setTimeout(() => {
    try {
      ConsentGroups.find()
        .fetch()
        .map(c => Meteor.call('consentGroups.updateStatus', c._id));
    } catch (err) {
      logger.warn('Failed to update consent group status');
    }
  }, 1);
  return ConsentGroups.find();
});

Meteor.publish('consentGroups.one', function publishOneConsentGroups(id) {
  logger.info(`PUB[${this.userId}]: consentGroups.one`, id);
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions
  return ConsentGroups.find(id);
});
