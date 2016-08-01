/**
 * Created by Kavi on 4/5/16.
 */
const querystring = require('querystring');

Template.viewClient.onRendered(() => {
  $('body').tooltip({ selector: '.js-tooltip' });
});

Template.viewClient.events(
  {
    'click .edit'(evt, tmpl) {
      const query = {};
      if (tmpl.data.isHMISClient) {
        query.query = 'isHMISClient=true';
      }
      Router.go('adminDashboardclientsEdit', { _id: tmpl.data._id }, query);
    },
    'click .back'() {
      Router.go('searchClient');
    },
    'click .add-to-hmis'(event, tmpl) {
      Meteor.call(
        'addClientToHMIS', tmpl.data._id, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            let query = 'addClientToHMISError=1';
            let clientId = tmpl.data._id;
            if (result) {
              const params = {
                addedToHMIS: 1,
                isHMISClient: true,
                link: result.link,
              };
              clientId = result._id;
              query = querystring.stringify(params);
            }

            Router.go('viewClient', { _id: clientId }, { query });
          }
        }
      );
    },
    'click .takeSurvey'(event, tmpl) {
      const query = {};

      if (Router.current().params && Router.current().params.query
        && Router.current().params.query.isHMISClient && Router.current().params.query.link) {
        const url = encodeURIComponent(Router.current().params.query.link);
        query.query = {
          isHMISClient: true,
          link: url,
        };
        // `isHMISClient=true&link=${url}`
      }

      Router.go('LogSurvey', { _id: tmpl.data._id }, query);
    },
  }
);
