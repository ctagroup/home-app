/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'housingUnits', function publishHousingUnits() {
    const self = this;

    let housingUnits = [];

    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);

      housingUnits = HMISAPI.getHousingUnitsForPublish();
    } else {
      HMISAPI.setCurrentUserId('');
    }

    _.each(housingUnits, (item) => {
      self.added('housingUnits', item.housingInventoryId, item);
    });

    self.ready();
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
