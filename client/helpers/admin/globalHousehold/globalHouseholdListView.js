/**
 * Created by Anush-PC on 7/19/2016.
 */

Template.globalHouseholdListView.helpers(
  {
    hasGlobalHousehold() {
      return globalHousehold.find({}).fetch();
    },
    globalHouseholdTableOptions() {
      // Deep Copy to avoid reference to the same array.
      // It was causing to add Edit/Delete column mulitple times
      let tableColumns = $.extend(true, [], AdminConfig.collections.globalHousehold.tableColumns);
      let showEditColumn = true;
      let showDeleteColumn = true;
      if (typeof AdminConfig.collections.globalHousehold.showEditColumn === 'boolean'
          && AdminConfig.collections.globalHousehold.showEditColumn === false) {
        showEditColumn = false;
      }

      if (typeof AdminConfig.collections.globalHousehold.showDelColumn === 'boolean'
          && AdminConfig.collections.globalHousehold.showDelColumn === false) {
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
    globalHouseholdData() {
      return () => globalHousehold.find({}).fetch();
    },
  }
);
