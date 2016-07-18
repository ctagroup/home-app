/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'housingUnits', function publishHousingUnits() {
    let housingUnits = [];

    if (this.userId) {
      HMISAPI.setCurrentUserId(this.userId);

      housingUnits = HMISAPI.getHousingUnitsForPublish();
    } else {
      HMISAPI.setCurrentUserId('');
    }

    return housingUnits;
  }
);
