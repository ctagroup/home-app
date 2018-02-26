import { eachLimit } from 'async';
import Users from '/imports/api/users/users';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';

function updateHmisProfile(userId, account) {
  const projects = account.projectGroup ? account.projectGroup.projects : [];
  const projectGroup = account.projectGroup || {};
  Users.update(userId, { $set: {
    'services.HMIS.emailAddress': account.emailAddress,
    'services.HMIS.firstName': account.firstName,
    'services.HMIS.middleName': account.middlName,
    'services.HMIS.lastName': account.lastName,
    'services.HMIS.gender': account.gender,
    'services.HMIS.status': account.status,
    'services.HMIS.roles': account.roles,
    'services.HMIS.projects': projects,
    'services.HMIS.projectGroup': { ...projectGroup, projects: undefined },
  } });
}


const fields = {
  'services.HMIS.emailAddress': 1,
  'services.HMIS.accountId': 1,
  'services.HMIS.firstName': 1,
  'services.HMIS.middleName': 1,
  'services.HMIS.lastName': 1,
  'services.HMIS.gender': 1,
  'services.HMIS.roles': 1,
  'services.HMIS.status': 1,
  'services.HMIS.projectGroup': 1,
  createdAt: 1,
  projectsLinked: 1, // TODO: is it required??
};

Meteor.publish('users.all', function publishAllUsers() {
  logger.debug(`Publishing users.all to ${this.userId}`);

  const extendedData = {
    ...fields,
    roles: 1,
  };
  let findOptions = { fields };
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) findOptions = extendedData;
  }

  const cursor = Users.find({}, findOptions);
  const api = HmisClient.create(this.userId).api('user-service');
  Meteor.defer(() => {
    eachLimit(
      cursor.fetch(), Meteor.settings.connectionLimit,
      (user, next) => {
        if (user.services && user.services.HMIS && user.services.HMIS.accountId) {
          const account = api.debug().getUser(user.services.HMIS.accountId);
          updateHmisProfile(user._id, account);
        } else {
          updateHmisProfile(user._id, {
            'services.HMIS.status': 'LOCAL USER',
          });
        }
        next();
      }
    );
  });
  return cursor;
});

Meteor.publish('users.one', function publishSingleHmisUser(userId) { // eslint-disable-line prefer-arrow-callback, max-len
  logger.debug(`Publishing users.one(${userId}) to ${this.userId}`);
  // TODO: permissions
  if (!this.userId) {
    return [];
  }

  const api = HmisClient.create(this.userId).api('user-service');

  const user = Users.findOne(userId);
  try {
    const hmisId = user.services.HMIS.accountId;
    const account = api.getUser(hmisId);
    updateHmisProfile(userId, account);
  } catch (e) {
    logger.warn(`users.one: failed to update HMIS profile for user ${userId}`, e);
  }

  return Users.find(userId, { fields: _.extend(fields, { roles: 1 }) });
});


Meteor.publish(null, function publishCurrentUserData() { // eslint-disable-line
  if (this.userId) {
    const data = {
      ...fields,
      roles: 1,
    };
    return Users.find(this.userId, { fields: data });
  }
});
