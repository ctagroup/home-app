/**
 * Created by udit on 26/02/16.
 */

Schemas.adminSettings = new SimpleSchema(
  {
    preClientProfileQuestions: {
      label: 'Pre - Client Profile Questions',
      type: Object,
      optional: true,
    },
    'preClientProfileQuestions.dvQuestion': {
      label: 'DV Question',
      type: Object,
      optional: true,
    },
    'preClientProfileQuestions.dvQuestion.question': {
      label: 'Question Text',
      type: String,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'summernote',
          class: 'editor', // optional
          settings: {
            minHeight: 100,             // set minimum height of editor
            fontNames: AdminConfig.fontFamilies,
          }, // summernote options goes here
        },
      },
    },
    'preClientProfileQuestions.dvQuestion.hotlineInfo': {
      label: 'Hotline Information',
      type: String,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'summernote',
          class: 'editor', // optional
          settings: {
            minHeight: 100,             // set minimum height of editor
            fontNames: AdminConfig.fontFamilies,
          }, // summernote options goes here
        },
      },
    },
    'preClientProfileQuestions.dvQuestion.skip': {
      label: 'Skip DV Question ?',
      type: Boolean,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'boolean-checkbox',
        },
      },
    },
    'preClientProfileQuestions.housingServiceQuestion': {
      label: 'Housing Service Question',
      type: Object,
      optional: true,
    },
    'preClientProfileQuestions.housingServiceQuestion.question': {
      label: 'Question Text',
      type: String,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'summernote',
          class: 'editor', // optional
          settings: {
            minHeight: 100,             // set minimum height of editor
            fontNames: AdminConfig.fontFamilies,
          }, // summernote options goes here
        },
      },
    },
    'preClientProfileQuestions.housingServiceQuestion.skip': {
      label: 'Skip Housing Service Question ?',
      type: Boolean,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'boolean-checkbox',
        },
      },
    },
    'preClientProfileQuestions.releaseOfInformation': {
      label: 'Release of Information',
      type: Object,
      optional: true,
    },
    'preClientProfileQuestions.releaseOfInformation.info': {
      label: 'Information Text',
      type: 'String',
      autoform: {
        afFieldInput: {
          type: 'summernote',
          class: 'editor', // optional
          settings: {
            minHeight: 100,             // set minimum height of editor
            fontNames: AdminConfig.fontFamilies,
          }, // summernote options goes here
        },
      },
    },
    'preClientProfileQuestions.releaseOfInformation.skip': {
      label: 'Skip Release of Information Question ?',
      type: Boolean,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'boolean-checkbox',
          trueLabel: true,
          falseLabel: false,
        },
      },
    },
  }
);
