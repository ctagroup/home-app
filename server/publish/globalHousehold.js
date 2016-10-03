/**
 * Created by Anush-PC on 7/19/2016.
 */

Meteor.publish(
  'globalHouseholds', function publishGlobalHouseholds() {
    const self = this;

    let globalHouseholds = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getGlobalHouseholdsForPublish();
      globalHouseholds = response.content;
      // according to the content received.
      logger.info(globalHouseholds.length);
      for (let i = 0; i < response.page.totalPages; i += 1) {
        const temp = HMISAPI.getGlobalHouseholdsForPublish(i);
        globalHouseholds.push(...temp.content);
        logger.info(`Temp: ${globalHouseholds.length}`);
        _.each(temp.content, (item) => {
          self.added('globalHouseholds', item.globalHouseholdId, item);
        });
        self.ready();
      }
      if (response.page.totalPages === 0) {
        self.ready();   // Condition where there are no records.
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
  }
);

Meteor.publish(
  'singleGlobalHousehold', function publishSingleGlobalHousehold(globalHouseholdId) {
    const self = this;
    let globalHousehold = false;
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      globalHousehold = HMISAPI.getSingleGlobalHouseholdForPublish(globalHouseholdId);
      const response = HMISAPI.getGlobalHouseholdMembersForPublish(globalHouseholdId);
      globalHousehold.clients = response.content;

      // starting from 1. because we already got the 0th page in previous call
      for (let i = 1; i < response.page.totalPages; i += 1) {
        const temp = HMISAPI.getGlobalHouseholdMembersForPublish(globalHouseholdId, i);
        globalHousehold.clients.push(...temp.content);
        logger.info(`Temp: ${globalHousehold.clients.length}`);
      }

      for (let i = 0; i < globalHousehold.clients.length; i += 1) {
        // TODO: By default schema is v2015 bcz we don't have info on that for now.
        globalHousehold.clients[i].clientDetails = HMISAPI.getClient(
          globalHousehold.clients[i].globalClientId,
          'v2015',
          // useCurrentUserObject
          false
        );
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
    if (globalHousehold) {
      self.added('globalHouseholds', globalHousehold.globalHouseholdId, globalHousehold);
    }
    self.ready();
  }
);
