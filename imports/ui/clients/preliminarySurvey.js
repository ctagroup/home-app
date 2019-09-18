import moment from 'moment';
import Alert from '/imports/ui/alert';
import OpeningScript from '/imports/api/openingScript/openingScript';
import '/imports/ui/rois/roisForm';
import './signaturePad.js';
import './preliminarySurvey.html';

const DV_HS_STEP = 0;
const ROI_STEP = 1;
const ENDED_STEP = 2;


function nextStep(currentStep) {
  switch (currentStep) {
    case DV_HS_STEP:
      return OpeningScript.skipReleaseOfInformation() ? ENDED_STEP : ROI_STEP;
    case ROI_STEP:
      return ENDED_STEP;
    case ENDED_STEP:
      return ENDED_STEP;
    default:
      if (!(OpeningScript.skipDvQuestion() && OpeningScript.skipHousingServiceQuestion())) {
        return DV_HS_STEP;
      }
      if (!OpeningScript.skipReleaseOfInformation()) return ROI_STEP;
      return ENDED_STEP;
  }
}


Template.preliminarySurvey.helpers({
  currentStep() {
    return Template.instance().activeStep.get();
  },
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
  showDvHsStep() {
    return Template.instance().activeStep.get() === 0;
  },
  showRoiStep() {
    return Template.instance().activeStep.get() === 1;
  },
  roiData() {
    return {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(3, 'Y').format('YYYY-MM-DD'),
    };
  },
});

Template.preliminarySurvey.events(
  {
    'click .close-cancel': (event) => {
      $('body').removeClass('modal-open');
      event.preventDefault();
      history.back();
    },
    'click .next-step': (event) => {
      event.preventDefault();
      const currentStep = Template.instance().activeStep.get();

      const signaturePad = Router.current().params.signaturePad;
      if (currentStep === ROI_STEP) {
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();
        const notes = $('#notes').val();

        if (!startDate) {
          Alert.error('You must provide ROI start date');
          return;
        }
        if (!endDate) {
          Alert.error('You must provide ROI end date');
          return;
        }
        if (signaturePad.isEmpty()) {
          Alert.error('Please provide signature first');
          return;
        }
        if ($('#roiAgreement').length && !$('#roiAgreement')[0].checked) {
          Alert.error('You must agree');
          return;
        }

        // set values in client form (see "createClient" template)
        $('#create-client-form #roiStartDate').val(startDate);
        $('#create-client-form #roiEndDate').val(endDate);
        $('#create-client-form #roiNotes').val(notes);
        $('#create-client-form .signature').val(signaturePad.toDataURL());
        $('#create-client-form .signature-img').attr('src', signaturePad.toDataURL());
      }

      Template.instance().activeStep.set(nextStep(currentStep));
    },
  }
);

Template.preliminarySurvey.onCreated(function onCreated() {
  this.activeStep = new ReactiveVar(nextStep());

  this.autorun(() => {
    if (this.activeStep.get() === ENDED_STEP) {
      $('#preliminarySurveyModal').modal('hide');
    }
  });
});
