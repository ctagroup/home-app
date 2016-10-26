/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'users', () => {
    if (typeof users === 'undefined') {
      return [];
    }
    return users.find({});
  }
);

Meteor.publish(
  'singleHMISUser', function publishSingleHMISUser(userId) {
    const self = this;

    let hmisUser = false;

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);

      const localUser = users.findOne({ _id: userId });

      if (localUser) {
        hmisUser = HMISAPI.getUserForPublish(localUser.services.HMIS.accountId);
        hmisUser.projectsLinked = localUser.projectsLinked;
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }

    if (hmisUser) {
      self.added('singleHMISUser', hmisUser.accountId, hmisUser);
    }

    return self.ready();
  }
);
