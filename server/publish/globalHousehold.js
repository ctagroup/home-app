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
      // starting from 1. because we already got the 0th page in previous call
      for (let i = 1; i < response.page.totalPages; i += 1) {
        const temp = HMISAPI.getGlobalHouseholdsForPublish(i);
        globalHouseholds.push(...temp.content);
        logger.info(`Temp: ${globalHouseholds.length}`);
      }

      for (let i = 0; i < globalHouseholds.length; i += 1) {
        globalHouseholds[i].headOfHouseholdClient = HMISAPI.getClient(
          globalHouseholds[i].headOfHouseholdId,
          // TODO: default schema because we don't know the schema for now.
          'v2015',
          // useCurrentUserObject
          false
        );
        globalHouseholds[i].userCreateDetails = HMISAPI.getUserForPublish(
          globalHouseholds[i].userCreate
        );
        globalHouseholds[i].userUpdateDetails = HMISAPI.getUserForPublish(
          globalHouseholds[i].userUpdate
        );
        self.added('globalHouseholds', globalHouseholds[i].globalHouseholdId, globalHouseholds[i]);
      }
      self.ready();
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
        let schema = 'v2015';
        if (globalHousehold.clients[i].links[0].rel.indexOf('v2014') !== -1) {
          schema = 'v2014';
        }
        globalHousehold.clients[i].clientDetails = HMISAPI.getClient(
          globalHousehold.clients[i].globalClientId,
          schema,
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
