// const querystring = require('querystring');
import { Template } from 'meteor/templating';
import Survey from '/imports/ui/components/surveyForm/Survey';
import './responsesNew.html';


Template.responsesNew.helpers({
  component() {
    return Survey;
  },
  definition() {
    return {
      title: 'Hardcoded survey',
      id: 1,
      variables: {
        score: 0,
      },
      sections: [
        {
          id: 'section1',
          title: 'Section 1',
          items: [
            {
              id: 'question1',
              type: 'question',
              title: 'Survey Location',
              category: 'text',
              required: true,
            },
            {
              id: 'question2',
              type: 'question',
              title: 'What is 2+2',
              category: 'text',
              rules: [
                {
                  always: ['hide'],
                },
                {
                  value: 'values.question1',
                  any: [['!=', '']],
                  then: ['show'],
                },
                {
                  value: 'values.question2',
                  any: [
                    ['==', 4],
                  ],
                  then: [
                    ['add', 'score', 1],
                  ],
                },
              ],
            },
            {
              id: 'question3',
              type: 'question',
              title: 'Enter a number larger that 3 and less or equal than 12',
              category: 'text',
              rules: [
                {
                  always: ['hide'],
                },
                {
                  value: 'values.question1',
                  any: [['!=', '']],
                  then: ['show'],
                },
                {
                  value: 'values.question3',
                  all: [
                    ['>', 3],
                    ['<=', 12],
                  ],
                  then: [
                    ['add', 'score', 1],
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'section2',
          title: 'Section 2',
          items: [
            {
              id: 'question4',
              type: 'question',
              title: 'How long is your beard?',
              text: 'In centimeters...',
              category: 'text',
              required: true,
              rules: [
                {
                  always: ['hide'],
                },
                {
                  value: 'client.gender',
                  any: [['==', 1]],
                  then: ['show'],
                },
              ],
            },
          ],
        },
        {
          id: 'section3',
          title: 'Summary',
          items: [
            {
              id: 'text1',
              type: 'text',
              title: 'Final score',
              text: 'Your final score is {{score}}. {{foo}}.',
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
