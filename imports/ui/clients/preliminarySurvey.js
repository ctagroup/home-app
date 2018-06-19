import Alert from '/imports/ui/alert';
import OpeningScript from '/imports/api/openingScript/openingScript';
import SignaturePadConfig from '/imports/ui/signaturePadConfig';
import './signaturePad.js';
import './selectConsentGroup.js';
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
});

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
    'submit #release-of-information': (event, tmpl) => {
      event.preventDefault();
      const selectedConsentGroupId = event.target[0].value;
      const signaturePad = Router.current().options.signaturePad;
      if (signaturePad.isEmpty()) {
        Bert.alert('Please provide signature first.', 'error', 'growl-top-right');
      } else if (!selectedConsentGroupId) {
        Bert.alert('Please select consent group first.', 'error', 'growl-top-right');
      } else {
        const clientId = tmpl.data.clientId;
        const signature = signaturePad.toDataURL();
        if (clientId) {
          const currentQuery = Router.current().params.query;
          const query = {};
          Meteor.call('clients.roi', clientId, signature);
          const dedupClientId = tmpl.data.dedupClientId;
          Meteor.call('consents.create', dedupClientId, selectedConsentGroupId, (err) => {
            if (err) {
              Alert.error(err);
            } else {
              Alert.success('Consent created.');
            }
          });
          if (currentQuery.schema) {
            query.query = { schema: currentQuery.schema };
          }
          if (currentQuery.selectSurvey) {
            return Router.go('selectSurvey', { _id: clientId }, query);
          }
          Router.go('viewClient', { _id: clientId }, query);
        } else {
          $('#create-client-form .signature').val(signature);
          $('#create-client-form .consent-group').val(selectedConsentGroupId);
          $('#create-client-form .signature-img').attr('src', signature);
          $('#releaseOfInformationModal').modal('hide');
        }
      }
      return false;
    },
  }
);
