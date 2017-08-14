import './signaturePad.js';
import './preliminarySurvey.html';


Template.preliminarySurvey.helpers(
  {
    skipDvQuestion() {
      const dvQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.dvQuestion.skip' }
      );

      let skip = false;

      if (dvQuestion && dvQuestion.option_value) {
        skip = (dvQuestion.option_value === 'true');
      }

      return skip;
    },
    dvQuestion() {
      const dvQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.dvQuestion.question' }
      );

      let question = '';

      if (dvQuestion && dvQuestion.option_value) {
        question = dvQuestion.option_value;
      }

      return question;
    },
    skipHousingServiceQuestion() {
      const housingServiceQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.skip' }
      );

      let skip = false;

      if (housingServiceQuestion && housingServiceQuestion.option_value) {
        skip = (housingServiceQuestion.option_value === 'true');
      }

      return skip;
    },
    housingServiceQuestion() {
      const housingServiceQuestion = options.findOne(
        { option_name: 'preClientProfileQuestions.housingServiceQuestion.question' }
      );

      let question = '';

      if (housingServiceQuestion && housingServiceQuestion.option_value) {
        question = housingServiceQuestion.option_value;
      }

      return question;
    },
    hotlineInfo() {
      const hotlineInfo = options.findOne(
        { option_name: 'preClientProfileQuestions.dvQuestion.hotlineInfo' }
      );

      let info = '';

      if (hotlineInfo && hotlineInfo.option_value) {
        info = hotlineInfo.option_value;
      }

      return info;
    },
    releaseOfInformation() {
      const releaseofInfo = options.findOne(
        { option_name: 'preClientProfileQuestions.releaseOfInformation.info' }
      );

      let info = '';

      if (releaseofInfo && releaseofInfo.option_value) {
        info = releaseofInfo.option_value;
      }

      return info;
    },
  }
);

Template.preliminarySurvey.events(
  {
    'click .js-close-preliminary-survey-modal': (event) => {
      event.preventDefault();
      $('#preliminarySurveyModal').modal('hide');
    },
    'click .js-goto-dashboard': (event) => {
      event.preventDefault();
      Router.go('dashboard');
    },
    'click .js-open-release-of-info-modal': (event) => {
      event.preventDefault();
      PreliminarySurvey.showReleaseOfInformation();
    },
    'submit #release-of-information': (event) => {
      event.preventDefault();
      const signaturePad = Router.current().params.signaturePad;
      if (signaturePad.isEmpty()) {
        alert('Please provide signature first.');
      } else {
        $('#create-client-form .signature').val(signaturePad.toDataURL());
        $('#create-client-form .signature-img').attr('src', signaturePad.toDataURL());
        $('#releaseOfInformationModal').modal('hide');
      }
      return false;
    },
  }
);
