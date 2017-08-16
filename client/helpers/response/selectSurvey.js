/**
 * Created by udit on 02/08/16.
 */

import { PendingClients } from '/imports/api/pendingClients/pendingClients';

Template.selectSurvey.helpers(
  {
    getCreatedSurvey() {
      return surveys.find({ created: true }).fetch();
    },
    getSurveyedClient() {
      return PendingClients.find().fetch();
    },
  }
);
