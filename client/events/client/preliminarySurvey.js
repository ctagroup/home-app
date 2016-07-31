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
