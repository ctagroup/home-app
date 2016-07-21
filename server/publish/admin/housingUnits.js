/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'housingUnits', function publishHousingUnits() {
    const self = this;

    let housingUnits = [];

    if (this.userId) {
      HMISAPI.setCurrentUserId(this.userId);

      housingUnits = HMISAPI.getHousingUnitsForPublish();
    } else {
      HMISAPI.setCurrentUserId('');
    }

    _.each(housingUnits, (item) => {
      self.added('housingUnits', Random.id(), item);
    });

    self.ready();
  }
);

Meteor.publish(
  'singleHousingUnits', function publishSingleHousingUnit(housingUnitId) {
    let housingUnit = false;

    if (this.userId) {
      HMISAPI.setCurrentUserId(this.userId);

      housingUnit = HMISAPI.getHousingUnitForPublish(housingUnitId);
    } else {
      HMISAPI.setCurrentUserId('');
    }
    return housingUnit;
  }
);
