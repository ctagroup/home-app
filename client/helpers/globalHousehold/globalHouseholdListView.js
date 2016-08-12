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
      delete Session.keys.selectedClients;
      let tableColumns = $.extend(true, [], HomeConfig.collections.globalHousehold.tableColumns);
      let showEditColumn = true;
      let showDeleteColumn = true;
      if (typeof HomeConfig.collections.globalHousehold.showEditColumn === 'boolean'
          && HomeConfig.collections.globalHousehold.showEditColumn === false) {
        showEditColumn = false;
      }

      if (typeof HomeConfig.collections.globalHousehold.showDelColumn === 'boolean'
          && HomeConfig.collections.globalHousehold.showDelColumn === false) {
        showDeleteColumn = false;
      }

      if (showEditColumn) {
        tableColumns = $.merge(tableColumns, [HomeConfig.appEditButton]);
      }

      if (showDeleteColumn) {
        tableColumns = $.merge(tableColumns, [HomeConfig.appDelButton]);
      }
      return {
        columns: tableColumns,
        dom: HomeConfig.adminTablesDom,
      };
    },
    globalHouseholdData() {
      return () => globalHousehold.find({}).fetch();
    },
  }
);

Template.selectedClientsView.helpers(
  {
    getSelectedClientList() {
      return Session.get('selectedClients');
    },
  });
