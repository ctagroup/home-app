/**
 * Created by udit on 15/07/16.
 */

Template.housingUnitsListView.helpers(
  {
    hasHousingUnits() {
      return housingUnits.find({}).fetch();
    },
    housingUnitsTableOptions() {
      const tableColumns = AdminConfig.collections.housingUnits.tableColumns;

      if (AdminConfig.collections.housingUnits.showEditColumn) {
        tableColumns.push(AdminConfig.adminEditButton);
      }
      if (AdminConfig.collections.housingUnits.showDelColumn) {
        tableColumns.push(AdminConfig.adminDelButton);
      }

      return {
        columns: tableColumns,
        dom: AdminConfig.adminTablesDom,
      };
    },
    housingUnitsData() {
      return () => housingUnits.find({}).fetch();
    },
  }
);
