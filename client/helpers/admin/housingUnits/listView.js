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
      let tableColumns = $.extend(true, [], HomeConfig.collections.housingUnits.tableColumns);

      let showEditColumn = true;
      let showDeleteColumn = true;

      if (typeof HomeConfig.collections.housingUnits.showEditColumn === 'boolean'
          && HomeConfig.collections.housingUnits.showEditColumn === false) {
        showEditColumn = false;
      }

      if (typeof HomeConfig.collections.housingUnits.showDelColumn === 'boolean'
          && HomeConfig.collections.housingUnits.showDelColumn === false) {
        showDeleteColumn = false;
      }

      if (showEditColumn) {
        tableColumns = $.merge(tableColumns, [HomeConfig.adminEditButton]);
      }

      if (showDeleteColumn) {
        tableColumns = $.merge(tableColumns, [HomeConfig.adminDelButton]);
      }

      return {
        columns: tableColumns,
        dom: HomeConfig.adminTablesDom,
      };
    },
    housingUnitsData() {
      return () => housingUnits.find({}).fetch();
    },
  }
);
