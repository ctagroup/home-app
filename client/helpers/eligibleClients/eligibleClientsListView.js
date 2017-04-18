/**
 * Created by Mj on 10/7/2016.
 */
import { EligibleClients } from '/imports/api/eligible-clients/eligible-clients';

Template.eligibleClientsListView.helpers(
  {
    // Add all helpers here.
    hasEligibleClients() {
      return EligibleClients.find({}).fetch();
    },
    eligibleClientsTableOptions() {
      return {
        columns: HomeConfig.collections.eligibleClients.tableColumns,
        dom: HomeConfig.adminTablesDom,
      };
    },
    eligibleClientsData() {
      return () => EligibleClients.find({}).fetch();
    },
  }
);
