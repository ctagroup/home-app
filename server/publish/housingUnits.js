/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'housingUnits', function publishHousingUnits() {
    const self = this;

    let housingUnits = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getHousingUnitsForPublish();
      housingUnits = response.content;
      // according to the content received.
      logger.info(housingUnits.length);
      for (let i = 0; i < response.page.totalPages; i++) {
        const temp = HMISAPI.getHousingUnitsForPublish(i);
        housingUnits.push.apply(housingUnits, temp.content);
        logger.info(`Temp: ${housingUnits.length}`);
        _.each(temp.content, (item) => {
          const tempItem = item;
          tempItem.project = HMISAPI.getProject(item.projectId);
          self.added('housingUnits', tempItem.housingInventoryId, tempItem);
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
  'singleHousingUnit', function publishSingleHousingUnit(housingUnitId) {
    const self = this;

    let housingUnit = false;

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);

      housingUnit = HMISAPI.getHousingUnitForPublish(housingUnitId);
    } else {
      HMISAPI.setCurrentUserId('');
    }

    if (housingUnit) {
      self.added('housingUnits', housingUnit.housingInventoryId, housingUnit);
    }

    self.ready();
  }
);
