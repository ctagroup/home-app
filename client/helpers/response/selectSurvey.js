/**
 * Created by udit on 02/08/16.
 */

import { PendingClients } from '/imports/api/clients/pending-clients';

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
