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
      title: 'VI-SPDAT Familiy 2.0',
      id: 1,
      variables: {
        'children.rows': 10,
      },
      items: [
        {
          id: 'section1',
          type: 'section',
          title: 'Basic Information',
          items: [
            {
              id: 'parent1',
              type: 'section',
              title: 'Parent 1',
              items: [
                {
                  id: 'parent1FirstName',
                  type: 'question',
                  category: 'text',
                  title: 'First Name',
                },
                {
                  id: 'parent1LastName',
                  type: 'question',
                  category: 'text',
                  title: 'Last Name',
                },
                {
                  id: 'parent1Dob',
                  type: 'question',
                  category: 'date',
                  title: 'Date of Birth',
                },
                {
                  id: 'parent1Age',
                  type: 'question',
                  category: 'number',
                  title: 'Age',
                },
              ],
            },
            {
              id: 'parent2',
              type: 'section',
              title: 'Parent 2',
              skip: 'Skip if second parent currently not part of the household',
              items: [
                {
                  id: 'parent2FirstName',
                  type: 'question',
                  category: 'text',
                  title: 'First Name',
                },
                {
                  id: 'parent2LastName',
                  type: 'question',
                  category: 'text',
                  title: 'Last Name',
                },
                {
                  id: 'parent2Dob',
                  type: 'question',
                  category: 'date',
                  title: 'Date of Birth',
                },
                {
                  id: 'parent2Age',
                  type: 'question',
                  category: 'number',
                  title: 'Age',
                },
              ],
            },
          ],
        },
        {
          id: 'section2',
          type: 'section',
          title: 'Section 2',
          items: [
            {
              id: 'children',
              title: 'Children',
              type: 'grid',
              rows: 2,
              columns: [
                {
                  id: 'children.firstName',
                  type: 'question',
                  title: 'First Name',
                  category: 'text',
                },
                {
                  id: 'children.age',
                  type: 'question',
                  title: 'Age',
                  category: 'text',
                },
              ],
            },
          ],
          rules: [
            {

            },
            {
              always: [
                ['rows', 'variables.numChildren'],
              ],
            },
          ],
        },
        {
          id: 'summary',
          type: 'text',
          title: 'Summary',
          text: 'TODO: summary',
          rules: [
            {
              // score - 1st
              any: [
                ['<=', 'values.parent1age', 60],
                ['<=', 'values.parent2age', 60],
              ],
              then: [['set', 'score1', 1]],
            },
            {
              // family score: single parent with 2 children
              all: [
                ['==', 'parent2.skip', 1],
                ['>=', 'variables.numChildren', 2],
              ],
              then: [['set', 'scoreFamilySize', 1]],
            },
            {
              // family score: single parent with young children
              all: [
                ['==', 'parent2.skip', 1],
                ['<=', 'min(values.children.age)', 11],
              ],
              then: [['set', 'scoreFamilySize', 1]],
            },
            {
              // family score: single parent with pregnancy
              all: [
                ['==', 'parent2.skip', 1],
                ['==', 'values.currentPregnancy', 'y'],
              ],
              then: [['set', 'scoreFamilySize', 1]],
            },
            {
              // family score: 2 parent and 3+ children or 6yr old or pregnancy
              any: [
                ['>=', 'variables.numChildren', 3],
                ['<=', 'min(values.children.age)', 6],
                ['==', 'values.currentPregnancy', 'y'],
              ],
              then: [['set', 'scoreFamilySize', 1]],
            },
          ],
        },
      ],
    };
  },
  /*
  definition2() {
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
  */
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
