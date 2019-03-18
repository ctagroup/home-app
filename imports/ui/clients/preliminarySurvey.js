import OpeningScript from '/imports/api/openingScript/openingScript';
import SignaturePadConfig from '/imports/ui/signaturePadConfig';
import './signaturePad.js';
import './preliminarySurvey.html';

Template.preliminarySurvey.helpers({
  skipDvQuestion() {
    return OpeningScript.skipDvQuestion();
  },
  dvQuestion() {
    return OpeningScript.dvQuestion();
  },
  skipHousingServiceQuestion() {
    return OpeningScript.skipHousingServiceQuestion();
  },
  housingServiceQuestion() {
    return OpeningScript.housingServiceQuestion();
  },
  hotlineInfo() {
    return OpeningScript.hotlineInfo();
  },
  releaseOfInformation() {
    return OpeningScript.releaseOfInformation();
  },
  showPreliminarySurveyModal() {
    return Template.instance().activeStep.get() === 0;
  },
  showReleaseOfInformationModal() {
    return Template.instance().activeStep.get() === 1;
  },
});

Template.preliminarySurvey.events(
  {
    'click .close-cancel': (event) => {
      event.preventDefault();
      history.back();
    },
    'click .next-step': (event) => {
      event.preventDefault();
      console.log(this, Template.instance());
    }
    /*
    'click .js-open-release-of-info-modal': (event) => {
      event.preventDefault();
      if (!OpeningScript.skipReleaseOfInformation()) {
        $('#releaseOfInformationModal').modal(
          {
            keyboard: false,
            backdrop: false,
          }
        );
        SignaturePadConfig.resizeCanvas();
      }
    },
    'submit #release-of-information': (event) => {
      event.preventDefault();
      const signaturePad = Router.current().params.signaturePad;
      if (signaturePad.isEmpty()) {
        Bert.alert('Please provide signature first.', 'error', 'growl-top-right');
      } else {
        $('#create-client-form .signature').val(signaturePad.toDataURL());
        $('#create-client-form .signature-img').attr('src', signaturePad.toDataURL());
        $('#releaseOfInformationModal').modal('hide');
      }
      return false;
    },
    */
  }
);

Template.preliminarySurvey.onRendered(function onCreated() {
  if (OpeningScript.showPreliminarySurveyModal()) {
    this.activeStep = new ReactiveVar(0);
  } else if (OpeningScript.showReleaseOfInformationModal()) {
    this.activeStep = new ReactiveVar(1);
  } else {
    this.activeStep = new ReactiveVar(2);
  }
});
