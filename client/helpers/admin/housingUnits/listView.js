/**
 * Created by udit on 15/07/16.
 */

Template.housingUnitsListView.helpers(
  {
    hasHousingUnits() {
      return housingUnits.find({}).fetch();
    },
    housingUnitsTableOptions() {
      // Deep Copy to avoid reference to the same array.
      // It was causing to add Edit/Delete column mulitple times
      let tableColumns = $.extend(true, [], AdminConfig.collections.housingUnits.tableColumns);

      let showEditColumn = true;
      let showDeleteColumn = true;

      if (typeof AdminConfig.collections.housingUnits.showEditColumn === 'boolean'
          && AdminConfig.collections.housingUnits.showEditColumn === false) {
        showEditColumn = false;
      }

      if (typeof AdminConfig.collections.housingUnits.showDelColumn === 'boolean'
          && AdminConfig.collections.housingUnits.showDelColumn === false) {
        showDeleteColumn = false;
      }

      if (showEditColumn) {
        tableColumns = $.merge(tableColumns, [AdminConfig.adminEditButton]);
      }

      if (showDeleteColumn) {
        tableColumns = $.merge(tableColumns, [AdminConfig.adminDelButton]);
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
