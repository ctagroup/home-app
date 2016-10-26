/**
 * Created by udit on 06/09/16.
 */

Meteor.publish(
  'hmisRoles', function publishHMISRoles() {
    const self = this;

    let hmisRoles = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getRoles(0, 30);
      hmisRoles = response.role;
      // according to the content received.
      logger.info(hmisRoles.length);
      for (let i = 0; (i * 30) < response.pagination.total; i += 1) {
        const temp = HMISAPI.getRoles((i * 30), 30);
        hmisRoles.push(...temp.role);
        logger.info(`Temp: ${hmisRoles.length}`);
        _.each(temp.role, (item) => {
          const tempItem = item;
          self.added('hmisRoles', tempItem.id, tempItem);
        });
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
    return self.ready();
  }
);
