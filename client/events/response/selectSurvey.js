/**
 * Created by udit on 02/08/16.
 */

const querystring = require('querystring');

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
          && Router.current().params.query.isHMISClient && Router.current().params.query.link) {
        const url = encodeURIComponent(Router.current().params.query.link);
        query.isHMISClient = true;
        query.link = url;
      }

      Router.go(
        'adminDashboardresponsesNew', {}, { query: querystring.stringify(query) }
      );
    },
    'click .backToClient': (/* evt, tmpl */) => {
      const query = {};

      if (Router.current().params && Router.current().params.query
          && Router.current().params.query.isHMISClient && Router.current().params.query.link) {
        const url = encodeURIComponent(Router.current().params.query.link);
        query.isHMISClient = true;
        query.link = url;
      }

      Router.go(
        'viewClient',
        { _id: Router.current().params._id },
        { query: querystring.stringify(query) }
      );
    },
  }
);
