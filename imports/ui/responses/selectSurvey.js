const querystring = require('querystring');
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

Template.selectSurvey.events(
  {
    'click .nextLogSurvey': (evt, tmpl) => {
      const surveyID = tmpl.find('.surveyList').value;
      const clientID = Router.current().params._id;

      const query = {
        client_id: clientID,
        survey_id: surveyID,
      };

      if (Router.current().params && Router.current().params.query
          && Router.current().params.query.schema) {
        query.isHMISClient = true;
        query.schema = Router.current().params.query.schema;
      }

      Router.go(
        'adminDashboardresponsesNew', {}, { query: querystring.stringify(query) }
      );
    },
    'click .backToClient': () => {
      const query = {};

      if (Router.current().params && Router.current().params.query
          && Router.current().params.query.schema) {
        query.isHMISClient = true;
        query.schema = Router.current().params.query.schema;
      }

      Router.go(
        'viewClient',
        { _id: Router.current().params._id },
        { query: querystring.stringify(query) }
      );
    },
  }
);
