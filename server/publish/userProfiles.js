/**
 * Created by udit on 04/09/16.
 */

Meteor.publish(
  'userProfiles', function publishUserProfiles() {
    const self = this;

    let userProfiles = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getUserProfiles(0, 30);
      userProfiles = response.profile;
      // according to the content received.
      logger.info(userProfiles.length);
      for (let i = 0; (i * 30) < response.pagination.total; i++) {
        const temp = HMISAPI.getUserProfiles((i * 30), 30);
        userProfiles.push.apply(userProfiles, temp.profile);
        logger.info(`Temp: ${userProfiles.length}`);
        _.each(temp.profile, (item) => {
          const tempItem = item;
          self.added('userProfiles', tempItem.id, tempItem);
        });
      }
      self.ready();
    } else {
      HMISAPI.setCurrentUserId('');
    }
  }
);
