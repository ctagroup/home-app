/**
 * Created by Anush-PC on 7/19/2016.
 */

Template.globalHouseholdListView.helpers(
  {
    hasGlobalHousehold() {
      return globalHousehold.find({}).fetch();
    },
    globalHouseholdTableOptions() {
      return {
        columns: HomeConfig.collections.globalHousehold.tableColumns,
        dom: HomeConfig.adminTablesDom,
      };
    },
    globalHouseholdData() {
      return () => globalHousehold.find({}).fetch();
    },
  }
);
