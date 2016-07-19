/**
 * Created by udit on 15/07/16.
 */

Template.housingUnitsListView.helpers(
  {
    hasHousingUnits() {
      return housingUnits.find({}).fetch();
    },
    housingUnitsTableOptions() {
      return {
        columns: AdminConfig.collections.housingUnits.tableColumns,
        dom: AdminConfig.adminTablesDom,
      };
    },
    housingUnitsData() {
      return () => housingUnits.find({}).fetch();
    },
  }
);
