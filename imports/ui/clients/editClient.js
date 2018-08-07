import { Clients } from '/imports/api/clients/clients';
import { RecentClients } from '/imports/api/recent-clients';
import Alert from '/imports/ui/alert';
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
      const methodName = client.clientId ? 'clients.update' : 'pendingClients.update';
      const query = client.clientId ? { isHMISClient: true, schema: client.schema } : {};

      const { clientVersions } = client;
      const { clientId, schema } = clientVersions && clientVersions.length ?
        clientVersions[clientVersions.length - 1] : { clientId: client._id, schema: client.schema };

      Meteor.call(methodName, clientId, data, schema, (error, result) => {
        if (error) {
          Alert.error(error);
        } else {
          Alert.success('Client updated');
          Clients._collection.update(client._id, { $set: result }); // eslint-disable-line
          Router.go('viewClient', { _id: client._id }, { query });
        }
      });
    },

    'click .delete': (evt, tmpl) => {
      const { client } = tmpl.data;
      const methodName = client.schema ? 'clients.delete' : 'pendingClients.delete';

      Meteor.call(methodName, client._id, client.schema, (error) => {
        if (error) {
          Alert.error(error);
        } else {
          Alert.success('Client deleted');
          RecentClients.remove(client._id);
          Router.go('adminDashboardclientsView');
        }
      });
    },

    'click .back': () => {
      history.back();
    },
  }
);
