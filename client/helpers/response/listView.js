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
        processing: true,
        deferRender: true,
      };
    },
    responsesData() {
      return () => responses.find({}).fetch();
    },
  }
);
