import AppSettings from '/imports/api/appSettings/appSettings';
import HomeConfig from '/imports/config/homeConfig';

class OpeningScriptClass {
  data() {
    return AppSettings.get('openingScript') || {
      openingScript: {
        dv: {},
        housingService: {},
        releaseOfInformation: {},
      },
    };
  }

  save(value) {
    AppSettings.set('openingScript', value);
  }

  skipDvQuestion() {
    return this.data().openingScript.dv.skip || false;
  }

  dvQuestion() {
    return this.data().openingScript.dv.question || '';
  }

  hotlineInfo() {
    return this.data().openingScript.dv.hotlineInfo || '';
  }

  skipHousingServiceQuestion() {
    return this.data().openingScript.housingService.skip || false;
  }

  housingServiceQuestion() {
    return this.data().openingScript.housingService.question || '';
  }

  skipReleaseOfInformation() {
    return this.data().openingScript.releaseOfInformation.skip || '';
  }

  releaseOfInformation() {
    return this.data().openingScript.releaseOfInformation.info || '';
  }

  showPreliminarySurvey() {
    const skipAll = this.skipDvQuestion()
      && this.skipHousingServiceQuestion()
      && this.skipReleaseOfInformation();
    return !skipAll;
  }
}

const OpeningScriptSchema = new SimpleSchema({
  openingScript: {
    label: 'Pre - Client Profile Questions',
    type: Object,
    optional: true,
  },
  'openingScript.dv': {
    label: 'DV Question',
    type: Object,
    optional: true,
  },
  'openingScript.dv.question': {
    label: 'Question Text',
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'summernote',
        class: 'editor', // optional
        settings: {
          minHeight: 100,             // set minimum height of editor
          fontNames: HomeConfig.gontFamilies,
        }, // summernote options goes here
      },
    },
  },
  'openingScript.dv.hotlineInfo': {
    label: 'Hotline Information',
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'summernote',
        class: 'editor', // optional
        settings: {
          minHeight: 100,             // set minimum height of editor
          fontNames: HomeConfig.fontFamilies,
        }, // summernote options goes here
      },
    },
  },
  'openingScript.dv.skip': {
    label: 'Skip DV Question?',
    type: Boolean,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'boolean-checkbox',
      },
    },
  },
  'openingScript.housingService': {
    label: 'Housing Service Question',
    type: Object,
    optional: true,
  },
  'openingScript.housingService.question': {
    label: 'Question Text',
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'summernote',
        class: 'editor', // optional
        settings: {
          minHeight: 100,             // set minimum height of editor
          fontNames: HomeConfig.fontFamilies,
        }, // summernote options goes here
      },
    },
  },
  'openingScript.housingService.skip': {
    label: 'Skip Housing Service Question?',
    type: Boolean,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'boolean-checkbox',
      },
    },
  },
  'openingScript.releaseOfInformation': {
    label: 'Release of Information',
    type: Object,
    optional: true,
  },
  'openingScript.releaseOfInformation.info': {
    label: 'Information Text',
    type: 'String',
    autoform: {
      afFieldInput: {
        type: 'summernote',
        class: 'editor', // optional
        settings: {
          minHeight: 100,             // set minimum height of editor
          fontNames: HomeConfig.fontFamilies,
        }, // summernote options goes here
      },
    },
  },
  'openingScript.releaseOfInformation.skip': {
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
});

const OpeningScript = new OpeningScriptClass();
OpeningScript.schema = OpeningScriptSchema;

export default OpeningScript;
