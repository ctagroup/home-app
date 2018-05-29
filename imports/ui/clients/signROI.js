import OpeningScript from '/imports/api/openingScript/openingScript';
import './preliminarySurvey.js';
import './signROI.html';

Template.signROI.onRendered(() => {
  const template = Template.instance();
  template.autorun(() => {
    if (OpeningScript.showPreliminarySurvey()) {
      $('#preliminarySurveyModal').modal(
        {
          keyboard: false,
          backdrop: false,
        }
      );
    } else {
      const clientId = template.data.clientId;
      const query = {};

      if (Router.current().params.query.schema) {
        query.query = { schema: Router.current().params.query.schema };
      }
      Router.go('selectSurvey', { _id: clientId }, query);
    }
  });
});
