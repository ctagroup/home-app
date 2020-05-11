import OpeningScript from '/imports/api/openingScript/openingScript';
import Alert from '/imports/ui/alert';
import './clientForm.js';
import './preliminarySurvey.js';
import './createClient.html';

Template.createClient.onRendered(() => {
  const template = Template.instance();
  template.autorun(() => {
    if (OpeningScript.showPreliminarySurvey()) {
      $('#preliminarySurveyModal').modal({
        keyboard: false,
        backdrop: false,
      });
    }
  });
});

Template.createClient.events({
  'click .save': (evt, tmpl) => {
    const client = {
      firstName: tmpl.find('.firstName').value,
      middleName: tmpl.find('.middleName').value,
      lastName: tmpl.find('.lastName').value,
      suffix: tmpl.find('.suffix').value,
      emailAddress: tmpl.find('.emailAddress').value,
      phoneNumber: tmpl.find('.phoneNumber').value,
      photo: tmpl.find('.photo').value,
      ssn: null,
      dob: tmpl.find('.dob').value,
      race: tmpl.find('.race_category').value,
      ethnicity: tmpl.find('.ethnicity_category').value,
      gender: tmpl.find('.gender_category').value,
      veteranStatus: tmpl.find('.veteranStatus_category').value,
      signature: tmpl.find('.signature') ? tmpl.find('.signature').value : '',
      disablingConditions: tmpl.find('.disablingConditions_category').value,
    };

    Meteor.callPromise('clients.create', client)
      .then(
        (result) => ({
          id: result.clientId,
          schema: result.schema,
          message: 'Client created in HMIS',
        }),
        (err) => {
          if (err.details && err.details.code === 400) {
            throw new Error(err.reason);
          }
          return Meteor.callPromise('pendingClients.create', client).then(
            (result) => ({
              id: result,
              message: 'Client created locally',
              messageType: 'warning',
            })
          );
        }
      )
      .then((result) => {
        const { id, schema, message, messageType } = result;
        if (messageType === 'warning') {
          Alert.warning(message);
        } else {
          Alert.success(message);
        }
        const query = schema ? { query: { schema } } : {};
        Router.go('viewClient', { _id: id }, query);
      })
      .catch((err) => Alert.error(err));
  },
  'click .cancel-client-creation': () => {
    history.back();
  },
});
