/**
 * Created by Mj on 24-Aug-16.
 */

Meteor.methods(
  {
    createHouseUnit(housingObject) {
      return HMISAPI.createHousingUnit(housingObject);
    },
    updateHouseUnit(housingObject) {
      return HMISAPI.updateHousingUnit(housingObject);
    },
    deleteHousing(housingInventoryId) {
      return HMISAPI.deleteHousingUnit(housingInventoryId);
    },
  }
);
