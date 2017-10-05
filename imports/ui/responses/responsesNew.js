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
        score1: 0,
        score2: 0,
        'score.presurvey': 0,
        'score.history': 0,
        'score.risks': 0,
        'score.socialization': 0,
        'score.wellness': 0,
        'score.familyunit': 0,
        'score.grandtotal': 0,
        numChildren: 0,
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
                  id: 'parent1.firstName',
                  type: 'question',
                  category: 'text',
                  title: 'First Name',
                },
                {
                  id: 'parent1.nickName',
                  type: 'question',
                  category: 'text',
                  title: 'Nickname',
                },
                {
                  id: 'parent1.lastName',
                  type: 'question',
                  category: 'text',
                  title: 'Last Name',
                },
                {
                  id: 'parent1.language',
                  type: 'question',
                  category: 'text',
                  title: 'In what language do you feel best able to express yourself',
                },
                {
                  id: 'parent1.dob',
                  type: 'question',
                  category: 'date',
                  title: 'Date of Birth',
                },
                {
                  id: 'parent1.age',
                  type: 'question',
                  category: 'number',
                  title: 'Age',
                },
                {
                  id: 'parent1.ssn',
                  type: 'question',
                  category: 'text',
                  title: 'SSN',
                },
                {
                  id: 'parent1.consent',
                  type: 'question',
                  category: 'choice',
                  title: 'Consent to participate',
                  options: ['Yes', 'No'],
                },
              ],
            },
            {
              id: 'parent2',
              type: 'section',
              title: 'Parent 2',
              skip: 'Second parent currently not part of the household',
              items: [
                {
                  id: 'parent2.firstName',
                  type: 'question',
                  category: 'text',
                  title: 'First Name',
                },
                {
                  id: 'parent2.nickName',
                  type: 'question',
                  category: 'text',
                  title: 'Nickname',
                },
                {
                  id: 'parent2.lastName',
                  type: 'question',
                  category: 'text',
                  title: 'Last Name',
                },
                {
                  id: 'parent1.language',
                  type: 'question',
                  category: 'text',
                  title: 'In what language do you feel best able to express yourself',
                },
                {
                  id: 'parent2.dob',
                  type: 'question',
                  category: 'date',
                  title: 'Date of Birth',
                },
                {
                  id: 'parent2.age',
                  type: 'question',
                  category: 'number',
                  title: 'Age',
                },
                {
                  id: 'parent2.consent',
                  type: 'question',
                  category: 'choice',
                  title: 'Consent to participate',
                  options: ['Yes', 'No'],
                },
              ],
            },
            {
              id: 'section1.score',
              type: 'text',
              title: 'SCORE: {{variables.score1}}',
              text: 'IF EITHER HEAD OF HOUSEHOLD IS 60 YEARS OF AGE OR OLDER, THEN SCORE 1.',
              rules: [
                {
                  // score - 1st
                  any: [
                    ['>=', 'values.parent1.age', 60],
                    ['>=', 'values.parent2.age', 60],
                  ],
                  then: [['set', 'score1', 1]],
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
              id: 'childrenNear',
              type: 'question',
              category: 'number',
              title: 'How many children under the age of 18 are currently with you?',
              refusable: true,
            },
            {
              id: 'childrenFar',
              type: 'question',
              category: 'number',
              title: 'How many children under the age of 18 are not currently with your family, but you have reason to believe they will be joining you when you get housed?',
              refusable: true,
            },
            {
              id: 'pregnantMember',
              type: 'question',
              category: 'choice',
              title: 'IF HOUSEHOLD INCLUDES A FEMALE: Is any member of the family currently pregnant?',
              options: ['Yes', 'No'],
              refusable: true,
            },
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
                  id: 'children.lastName',
                  type: 'question',
                  title: 'Last Name',
                  category: 'text',
                },
                {
                  id: 'children.age',
                  type: 'question',
                  title: 'Age',
                  category: 'number',
                },
                {
                  id: 'children.dob',
                  type: 'question',
                  title: 'Date of Birth',
                  category: 'date',
                },
              ],
              rules: [
                {
                  id: 'numChildren',
                  always: [
                    ['set', 'youngestChildAge', 'values.children.age:min'],
                    ['add', 'numChildren', 'values.childrenNear'],
                    ['add', 'numChildren', 'values.childrenFar'],
                    ['rows', 'variables.numChildren'],
                  ],
                },
              ],
            },
            {
              id: 'section2.score',
              type: 'text',
              title: 'SCORE: {{variables.score2}}',
              text: [
                'IF THERE IS A SINGLE PARENT WITH 2+ CHILDREN, AND/OR A CHILD AGED 11 OR YOUNGER AND/OR A CURRENT PREGNANCY, THEN SCORE 1 FOR FAMILY SIZE.',
                'IF THERE ARE TWO PARENTS WITH 3+ CHILDREN, AND/OR A CHILD AGED 6 OR YOUNGER AND/OR A CURRENT PREGNANCY, THEN SCORE 1 FOR FAMILY SIZE.',
              ].join('<br />'),
              rules: [
                {
                  id: 'singe2children',
                  comment: 'single parent with 2 children',
                  all: [
                    ['==', 'props.parent2.skip', 1],
                    ['>=', 'variables.numChildren', 2],
                  ],
                  then: [['set', 'score2', 1]],
                },
                {
                  id: 'singleYoungChild',
                  comment: 'single parent with young children',
                  all: [
                    ['==', 'props.parent2.skip', 1],
                    ['<=', 'values.children.age:min', 11],
                  ],
                  then: [['set', 'score2', 1]],
                },
                {
                  id: 'singePregnancy',
                  comment: 'single parent with pregnancy',
                  all: [
                    ['==', 'props.parent2.skip', 1],
                    ['==', 'values.pregnantMember', 'Yes'],
                  ],
                  then: [['set', 'score2', 1]],
                },
                {
                  id: 'doublePregnancyOr3children',
                  comment: '2 parent and 3+ children or 6yr old or pregnancy',
                  any: [
                    ['>=', 'variables.numChildren', 3],
                    ['<=', 'values.children.age:min', 6],
                    ['==', 'values.pregnantMember', 'Yes'],
                  ],
                  then: [
                    ['set', 'minChildrenAge', 'values.children.age:min'],
                    ['set', 'score2', 1],
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'history',
          type: 'section',
          title: 'A. History of Housing and Homelessness',

        },
        {
          id: 'risks',
          type: 'section',
          title: 'B. Risks',
        },
        {
          id: 'socialization',
          type: 'section',
          title: 'C. Socialization & Daily Functioning',
        },
        {
          id: 'wellness',
          type: 'section',
          title: 'D. Wellness',
        },
        {
          id: 'familyunit',
          type: 'section',
          title: 'E. Family Unit',
        },
        {
          id: 'summary',
          type: 'text',
          title: 'Scoring Summary',
          text: [
            'PRE-SURVEY: {{variables.score.presurvey}}/2',
            'A. HISTORY OF HOUSING & HOMELESSNESS: {{variables.score.history}}/2',
            'B. RISKS: {{variables.score.risks}}/4',
            'C. SOCIALIZATION & DAILY FUNCTIONS: {{variables.score.socialization}}/4',
            'D. WELLNESS: {{variables.score.wellness}}/6',
            'E. FAMILY UNIT: {{variables.score.familyunit}}/4',
            '<strong>GRAND TOTAL: {{variables.score.grandtotal}}/22</strong>',
          ].join('<br />'),
        },
        {
          id: 'followup',
          type: 'section',
          title: 'Follow-Up Questions',
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
