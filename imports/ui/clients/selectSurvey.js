import querystring from 'querystring';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import Surveys from '/imports/api/surveys/surveys';
import './selectSurvey.html';


Template.selectSurvey.helpers(
  {
    getCreatedSurvey() {
      return Surveys.find({ created: true }).fetch();
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
        clientId: clientID,
        surveyId: surveyID,
      };

      if (Router.current().params.query.schema) {
        query.schema = Router.current().params.query.schema;
      }

      Router.go(
        'adminDashboardresponsesNew', {}, { query: querystring.stringify(query) }
      );
    },
    'click .backToClient': () => {
      const query = {};

      if (Router.current().params.query.schema) {
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
