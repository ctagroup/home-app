/**
 * Created by udit on 02/09/16.
 */

Meteor.publish(
  'projectGroups', function publishProjectGroups() {
    const self = this;

    let projectGroups = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getProjectGroups(0, 30);
      projectGroups = response.projectGroups;
      // according to the content received.
      logger.info(projectGroups.length);
      for (let i = 0; (i * 30) < response.pagination.total; i += 1) {
        const temp = HMISAPI.getProjectGroups((i * 30), 30);
        projectGroups.push(...temp.projectGroups);
        logger.info(`Temp: ${projectGroups.length}`);
        _.each(temp.projectGroups, (item) => {
          const tempItem = item;
          self.added('projectGroups', tempItem.projectGroupId, tempItem);
        });
      }
      self.ready();
    } else {
      HMISAPI.setCurrentUserId('');
    }
  }
);
