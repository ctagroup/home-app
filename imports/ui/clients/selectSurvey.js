import querystring from 'querystring';
import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import Surveys from '/imports/api/surveys/surveys';
import './selectSurvey.html';


Template.selectSurvey.helpers(
  {
    getSurveys() {
      const surveys = Surveys.find({ 'hmis.surveyId': { $exists: true } }).fetch();
      return surveys;
      // return Surveys.find({ 'hmis.surveyId': { $exists: true } }).fetch();
    },
    getSurveyedClient() {
      return PendingClients.find().fetch();
    },
  }
);

Template.selectSurvey.events(
  {
    'click .nextLogSurvey': (evt, tmpl) => {
      const surveyId = tmpl.find('.surveyList').value;
      const clientId = Router.current().params._id;

      if (!surveyId) return;

      const query = { clientId, surveyId };

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
