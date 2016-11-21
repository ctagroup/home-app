/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'housingUnits', function publishHousingUnits() {
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    let housingUnits = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getHousingUnitsForPublish();
      housingUnits = response.content;
      // according to the content received.
      logger.info(housingUnits.length);
      for (let i = 0; i < response.page.totalPages && !stopFunction; i++) {
        const temp = HMISAPI.getHousingUnitsForPublish(i);
        housingUnits.push(...temp.content);
        logger.info(`Temp: ${housingUnits.length}`);
        for (let j = 0; j < temp.content.length && !stopFunction; j++) {
          const item = temp.content[j];
          const tempItem = item;

          let schema = 'v2015';
          if (item.links && item.links.length > 0
              && item.links[0].rel.indexOf('v2014') !== -1) {
            schema = 'v2014';
          }

          tempItem.project = HMISAPI.getProjectForPublish(item.projectId, schema);
          self.added('housingUnits', tempItem.housingInventoryId, tempItem);
          self.ready();
        }
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
    return self.ready();
  }
);

Meteor.publish(
  'singleHousingUnit', function publishSingleHousingUnit(housingUnitId) {
    const self = this;

    let housingUnit = false;

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);

      housingUnit = HMISAPI.getHousingUnitForPublish(housingUnitId);

      let schema = 'v2015';
      if (housingUnit.links && housingUnit.links.length > 0
          && housingUnit.links[0].rel.indexOf('v2014') !== -1) {
        schema = 'v2014';
      }

      housingUnit.project = HMISAPI.getProjectForPublish(housingUnit.projectId, schema);
    } else {
      HMISAPI.setCurrentUserId('');
    }

    if (housingUnit) {
      self.added('housingUnits', housingUnit.housingInventoryId, housingUnit);
    }

    return self.ready();
  }
);
