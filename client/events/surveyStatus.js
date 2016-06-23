/**
 * Created by Kavi on 5/19/16.
 */
Template.surveyStatusRow.events(
  {
    'click .survey_route'(evt, tmpl) {
      const responseID = tmpl.data._id;
      const responseCollection = adminCollectionObject('responses');
      const responseRecords = responseCollection.find({ _id: responseID }).fetch();
      for (let i = 0; i < responseRecords.length; i ++) {
        {
          const id = responseRecords[i]._id;
          const audience = responseRecords[i].audience;
          Router.go('LogSurveyView', { _id: id }, { query: { audience } });
        }
      }
    },
  }
);
