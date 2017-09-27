// const querystring = require('querystring');
import { Template } from 'meteor/templating';
import SurveyForm from '/imports/ui/components/SurveyForm';
import './responsesNew.html';


Template.responsesNew.helpers({
  component() {
    return SurveyForm;
  },
  definition() {
    return {
      title: 'Hardcoded survey',
      id: 1234,
      variables: {
        foo: 1,
        bar: 1,
      },
      sections: [
        {
          id: 'section1',
          title: 'Section 1',
          questions: [
            {
              id: 'question1',
              title: 'Survey Location',
              type: 'text',
              required: true,
            },
            {
              id: 'question2',
              title: 'Survey Time',
              type: 'text',
              rules: [
                {
                  question: 'question1',
                  any: [
                    ['==', 'foo'],
                    ['==', 'bar'],
                  ],
                  then: ['hide', ['set', 'foo', 1]],
                },
                {
                  otherwise: ['show'],
                },
              ],
            },
          ],
        },
      ],
    };
  },
});




/*
Template.responsesNew.events(
  {
    'click .pause_survey': (evt, tmpl) => {
      ResponseHelpers.saveResponse('Paused', tmpl);
    },
    'click .save_survey': (evt, tmpl) => {
      ResponseHelpers.saveResponse('Submit', tmpl);
    },
    'click .cancel_survey': (evt, tmpl) => {
      const query = {};

      if (Router.current().params && Router.current().params.query
          && Router.current().params.query.schema) {
        query.isHMISClient = true;
        query.schema = Router.current().params.query.schema;
      }

      Router.go(
        'selectSurvey',
        { _id: tmpl.data.client._id },
        { query: querystring.stringify(query) }
      );
    },
  }
);
*/
