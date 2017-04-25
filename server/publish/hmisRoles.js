/**
 * Created by udit on 06/09/16.
 */
import { logger } from '/imports/utils/logger';

Meteor.publish(
  'hmisRoles', function publishHMISRoles() {
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    let hmisRoles = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getRoles(0, 30);
      hmisRoles = response.role;
      // according to the content received.
      logger.info(hmisRoles.length);
      for (let i = 0; (i * 30) < response.pagination.total && !stopFunction; i += 1) {
        const temp = HMISAPI.getRoles((i * 30), 30);
        hmisRoles.push(...temp.role);
        logger.info(`Temp: ${hmisRoles.length}`);
        for (let j = 0; j < temp.role.length && !stopFunction; j += 1) {
          const tempItem = temp.role[j];
          self.added('hmisRoles', tempItem.id, tempItem);
          self.ready();
        }
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
    return self.ready();
  }
);
