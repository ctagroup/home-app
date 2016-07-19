/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'housingUnits', function publishHousingUnits() {
    const self = this;

    let housingUnits = [];

    if (this.userId) {
      // HMISAPI.setCurrentUserId(this.userId);
      //
      // housingUnits = HMISAPI.getHousingUnitsForPublish();
    } else {
      HMISAPI.setCurrentUserId('');
    }

    housingUnits = [
      {
        _id: '123',
        inactive: false,
        housingInventoryId: null,
        bedsCurrent: 5,
        projectId: 'test-project',
        userId: 'shubas',
        bedsCapacity: 6,
        familyUnit: null,
        inService: null,
        vacant: null,
        housingUnitAddress: {
          line1: 'addr line 1',
          line2: 'addr line 2',
          state: 'NY',
          city: 'Austin',
          zipCode: 73308,
        },
      },
      {
        _id: '123',
        inactive: false,
        housingInventoryId: null,
        bedsCurrent: 5,
        projectId: 'test-project',
        userId: 'shubas',
        bedsCapacity: 6,
        familyUnit: null,
        inService: null,
        vacant: null,
        housingUnitAddress: {
          line1: 'addr line 1',
          line2: 'addr line 2',
          state: 'NY',
          city: 'Austin',
          zipCode: 73308,
        },
      },
    ];

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
