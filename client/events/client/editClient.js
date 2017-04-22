/**
 * Created by udit on 01/08/16.
 */


Template.editClient.events(
  {
    'click .update': (evt, tmpl) => {
      evt.preventDefault();
      const firstName = tmpl.find('.firstName').value;
      const middleName = tmpl.find('.middleName').value;
      const lastName = tmpl.find('.lastName').value;
      const suffix = tmpl.find('.suffix').value;
      const emailAddress = tmpl.find('.emailAddress').value;
      const phoneNumber = tmpl.find('.phoneNumber').value;
      const photo = tmpl.find('.photo').value;
      const ssn = tmpl.find('.ssn').value;
      const dob = tmpl.find('.dob').value;
      const race = tmpl.find('.race_category').value;
      const ethnicity = tmpl.find('.ethnicity_category').value;
      const gender = tmpl.find('.gender_category').value;
      const veteranStatus = tmpl.find('.veteranStatus_category').value;
      const disablingConditions = tmpl.find('.disablingConditions_category').value;

      const client = tmpl.data;
      const methodName = client.clientId ? 'updateClient' : 'updatePendingClient';
      const query = client.clientId ? { isHMISClient: true, schema: client.schema } : {};

      Meteor.call(methodName, client._id, { firstName, middleName, lastName,
        suffix, emailAddress, phoneNumber, photo, ssn, dob, race, ethnicity, gender, veteranStatus,
        disablingConditions }, client.schema,
        (error) => {
          if (error) {
            Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Client updated', 'success', 'growl-top-right');
            Router.go('viewClient', { _id: client._id }, { query });
          }
        }
      );
    },

    'click .delete': (evt, tmpl) => {
      const client = tmpl.data;
      const methodName = client.clientId ? 'removeClient' : 'removePendingClient';

      Meteor.call(methodName, client._id, (error) => {
        if (error) {
          Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Client deleted', 'success', 'growl-top-right');
          Router.go('adminDashboardclientsView');
        }
      });
    },

    'click .back': () => {
      history.back();
    },
  }
);
