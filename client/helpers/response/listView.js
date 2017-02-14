Template.responsesListView.helpers(
  {
    // Add all helpers here.
    hasResponses() {
      const query = Router.current().params.query;
      const clientID = query ? query.clientID : false;

      if (clientID) {
        return () => responses.find({ clientID }).count() > 0;
      }

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
      const query = Router.current().params.query;
      const clientID = query ? query.clientID : false;

      if (clientID) {
        return () => responses.find({ clientID }).fetch();
      }

      return () => responses.find({}).fetch();
    },
  }
);
