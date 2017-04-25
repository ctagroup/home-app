/**
 * Created by udit on 04/09/16.
 */
import { logger } from '/imports/utils/logger';

Meteor.publish(
  'userProfiles', function publishUserProfiles() {
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    let userProfiles = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getUserProfiles(0, 30);
      userProfiles = response.profile;
      // according to the content received.
      logger.info(userProfiles.length);
      for (let i = 0; (i * 30) < response.pagination.total && !stopFunction; i += 1) {
        const temp = HMISAPI.getUserProfiles((i * 30), 30);
        userProfiles.push(...temp.profile);
        logger.info(`Temp: ${userProfiles.length}`);
        for (let j = 0; j < temp.profile.length && !stopFunction; j += 1) {
          const tempItem = temp.profile[j];
          self.added('userProfiles', tempItem.id, tempItem);
          self.ready();
        }
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
    return self.ready();
  }
);
