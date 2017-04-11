/**
 * Created by udit on 02/08/16.
 */

import { Clients } from '/imports/api/clients/clients';

Template.selectSurvey.helpers(
  {
    getCreatedSurvey() {
      return surveys.find({ created: true }).fetch();
    },
    getSurveyedClient() {
      return Clients.find().fetch();
    },
  }
);
