import Users from '/imports/api/users/users';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';

const fields = {
  'services.HMIS.emailAddress': 1,
  'services.HMIS.accountId': 1,
  'services.HMIS.firstName': 1,
  'services.HMIS.middleName': 1,
  'services.HMIS.lastName': 1,
  'services.HMIS.gender': 1,
  'services.HMIS.roles': 1,
  'services.HMIS.status': 1,
  projectsLinked: 1, // TODO: is it required??
};

Meteor.publish('users.all', () => Users.find({}, { fields }));

Meteor.publish('users.one', function publishSingleHmisUser(userId) { // eslint-disable-line prefer-arrow-callback, max-len
  logger.debug(`Publishing users.one(${userId}) to ${this.userId}`);
  // TODO: permissions
  if (!this.userId) {
    return [];
  }

  const hc = HmisClient.create(this.userId);

  const user = Users.findOne(userId);
  try {
    const hmisId = user.services.HMIS.accountId;
    const account = hc.api('user-service').getUser(hmisId);
    Users.update(userId, { $set: {
      'services.HMIS.emailAddress': account.emailAddress,
      'services.HMIS.firstName': account.firstName,
      'services.HMIS.middleName': account.middlName,
      'services.HMIS.lastName': account.lastName,
      'services.HMIS.gender': account.gender,
      'services.HMIS.status': account.status,
      'services.HMIS.roles': account.roles,
      'services.HMIS.projects': account.projectGroup.projects,
    } });
  } catch (e) {
    logger.warn(`users.one: failed to update HMIS profile for user ${userId}`, e);
  }

  return Users.find(userId, { fields: _.extend(fields, { roles: 1 }) });
});
