/**
 * Created by Mj on 24-Aug-16.
 */

Meteor.methods(
  {
    getAllProjects() {
      return HMISAPI.getProjects();
    },
    createHouseUnit(housingObject) {
      return HMISAPI.createHousingUnit(housingObject);
    },
    updateHouseUnit(housingObject) {
      return HMISAPI.updateHousingUnit(housingObject);
    },
  }
);
