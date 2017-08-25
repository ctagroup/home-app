import Users from '/imports/api/users/users';

const fields = {
  'services.HMIS.emailAddress': 1,
  'services.HMIS.firstName': 1,
  'services.HMIS.id': 1,
  'services.HMIS.lastName': 1,
  'services.HMIS.name': 1,
  'services.HMIS.roles': 1,
};

Meteor.publish('users.all', () => Users.find({}, { fields }));

Meteor.publish('users.one', function publishSingleHMISUser(userId) { // eslint-disable-line prefer-arrow-callback, max-len
  // TODO: syc data?
  return Users.find(userId, { fields: _.extend(fields, { roles: 1 }) });
  /*
  const self = this;

  let hmisUser = false;

  if (self.userId) {
    HMISAPI.setCurrentUserId(self.userId);

    const localUser = Users.findOne({ _id: userId });

    if (localUser && localUser.services
        && localUser.services.HMIS && localUser.services.HMIS.accountId) {
      hmisUser = HMISAPI.getUserForPublish(localUser.services.HMIS.accountId);

      if (localUser.projectsLinked) {
        hmisUser.projectsLinked = localUser.projectsLinked;
      }
    }
  } else {
    HMISAPI.setCurrentUserId('');
  }

  if (hmisUser) {
    self.added('users', hmisUser.accountId, hmisUser);
  }

  return self.ready();
  */
});
