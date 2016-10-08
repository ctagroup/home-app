/**
 * Created by Mj on 10/7/2016.
 */

Template.eligibleClientsListView.helpers(
  {
    // Add all helpers here.
    hasEligibleClients() {
      return eligibleClients.find({}).fetch();
    },
    eligibleClientsTableOptions() {
      return {
        columns: HomeConfig.collections.eligibleClients.tableColumns,
        dom: HomeConfig.adminTablesDom,
      };
    },
    eligibleClientsData() {
      return () => eligibleClients.find({}).fetch();
    },
  }
);
