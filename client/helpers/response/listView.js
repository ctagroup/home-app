Template.responsesListView.helpers(
  {
    // Add all helpers here.
    hasResponses() {
      return responses.find({}).count() > 0;
    },
    responsesTableOptions() {
      return {
        columns: HomeConfig.collections.responses.tableColumns,
        dom: HomeConfig.adminTablesDom,
      };
    },
    responsesData() {
      return () => responses.find({}).fetch();
    },
  }
);
