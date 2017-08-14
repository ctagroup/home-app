import { Clients } from '/imports/api/clients/clients';
import './editClient.html';


Template.editClient.events(
  {
    'click .update': (evt, tmpl) => {
      evt.preventDefault();
      const data = {
        firstName: tmpl.find('.firstName').value,
        middleName: tmpl.find('.middleName').value,
        lastName: tmpl.find('.lastName').value,
        suffix: tmpl.find('.suffix').value,
        emailAddress: tmpl.find('.emailAddress').value,
        phoneNumber: tmpl.find('.phoneNumber').value,
        photo: tmpl.find('.photo').value,
        ssn: tmpl.find('.ssn').value,
        dob: tmpl.find('.dob').value,
        race: tmpl.find('.race_category').value,
        ethnicity: tmpl.find('.ethnicity_category').value,
        gender: tmpl.find('.gender_category').value,
        veteranStatus: tmpl.find('.veteranStatus_category').value,
        disablingConditions: tmpl.find('.disablingConditions_category').value,
      };

      const client = tmpl.data.client;
      const methodName = client.clientId ? 'updateClient' : 'updatePendingClient';
      const query = client.clientId ? { isHMISClient: true, schema: client.schema } : {};

      Meteor.call(methodName, client._id, data, client.schema, (error, result) => {
        if (error) {
          Bert.alert(error.reason || error.error, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Client updated', 'success', 'growl-top-right');
          Clients._collection.update(client._id, { $set: result });  // eslint-disable-line
          Router.go('viewClient', { _id: client._id }, { query });
        }
      });
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
