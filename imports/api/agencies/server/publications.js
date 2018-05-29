import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
import Agencies from '../agencies';


Meteor.publish('agencies.all', function publishUserAgencies() {
  logger.info(`PUB[${this.userId}]: agencies.all`);
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions
  return Agencies.find();
});

Meteor.publish('agencies.one', function publishOneAgency(id) {
  logger.info(`PUB[${this.userId}]: agencies.one`, id);
  if (!this.userId) {
    return [];
  }

  // TODO: check permissions

  return Agencies.find(id);
});

Meteor.publish('agencies.active', function publishAgenciesOfCurrentUser() {
  logger.info(`PUB[${this.userId}]: agencies.active`);
  const user = Users.findOne(this.userId);
  const query = {
    consentGroups: user.activeConsentGroupId,
    members: this.userId,
  };
  return Agencies.find(query);
});
