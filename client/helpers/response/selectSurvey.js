/**
 * Created by udit on 02/08/16.
 */

Template.selectSurvey.helpers(
  {
    getCreatedSurvey() {
      return surveys.find({ created: true }).fetch();
    },
    getSurveyedClient() {
      return clients.find().fetch();
    },
  }
);
