/**
 * Created by Anush-PC on 7/19/2016.
 */

Template.housingMatchListView.helpers(
  {
    hasHousingMatch() {
      return housingMatch.find({}).fetch();
    },
    housingMatchTableOptions() {
      return {
        columns: HomeConfig.collections.housingMatch.tableColumns,
        dom: HomeConfig.adminTablesDom,
      };
    },
    housingMatchData() {
      return () => housingMatch.find({}).fetch();
    },
  }
);
