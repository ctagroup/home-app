import { ReactiveVar } from 'meteor/reactive-var';
import { Clients } from '/imports/api/clients/clients';
import { RecentClients } from '/imports/api/recent-clients';
import Alert from '/imports/ui/alert';
import './editClient.html';
import { getClientVersion } from '/imports/api/clients/helpers.js';

// TODO: match by clientId+schema instead of just clientId?

Template.editClient.onCreated(function editClientOnCreated() {
  this.selected = new ReactiveVar(false);
});

Template.editClient.events(
  {
    'change #version-select'(evt, tmpl) {
      const selectedId = evt.target.value;
      tmpl.selected.set(selectedId);
    },
    'click .versionItem'(evt, tmpl) {
      const selectedId = this.value;
      tmpl.selected.set(selectedId);
    },
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

      const { clientVersions } = client;
      const selectedId = tmpl.selected.get();
      let clientId;
      let schema;
      if (clientVersions && clientVersions.length) {
        if (selectedId) {
          const selectedVersion = _.find(clientVersions, (item) => item.clientId === selectedId);
          clientId = selectedVersion.clientId;
          schema = selectedVersion.schema;
        } else {
          clientId = clientVersions[clientVersions.length - 1].clientId;
          schema = clientVersions[clientVersions.length - 1].schema;
        }
      } else {
        clientId = client._id;
        schema = client.schema;
      }

      Meteor.call(methodName, clientId, data, schema, (error, result) => {
        if (error) {
          Alert.error(error);
        } else {
          Alert.success('Client updated');
          if (selectedId) {
            const moreData = _.map(result, (v, k) => {
              if (['_id', 'schema', 'clientId'].includes(k)) return {};
              return { [`${k}::${schema}::${selectedId}`]: v };
            });
            Clients._collection.update(client._id, { $set: Object.assign({}, ...moreData) }); // eslint-disable-line
          } else {
            Clients._collection.update(client._id, { $set: result }); // eslint-disable-line
          }
          const query = client.clientId ? { isHMISClient: true, schema: client.schema } : {};
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
          RecentClients.remove(client);
          Router.go('adminDashboardclientsView');
        }
      });
    },

    'click .back': () => {
      history.back();
    },
  }
);

const LATEST = 'Global Client';

function versionOptions(clientVersions, selectedId) {
  const options = clientVersions.map(({ schema, clientId }) => ({
    value: clientId,
    label: `${schema}-${clientId}`,
    selected: clientId === selectedId,
  }));

  return [{
    value: null,
    label: LATEST,
  }, ...options];
}

Template.editClient.helpers({
  currentVersion() {
    if (this && this.client) {
      const selectedId = Template.instance() && Template.instance().selected.get();
      const selected = versionOptions(this.client.clientVersions, selectedId)
        .filter(p => p.selected);
      if (selected.length) return selected[0].label;
      return LATEST;
    }
    return LATEST;
  },
  options() {
    if (this && this.client) {
      const selectedId = Template.instance() && Template.instance().selected.get();
      return versionOptions(this.client.clientVersions, selectedId);
    }
    return [{
      value: null,
      label: LATEST,
    }];
  },
  selectedClient() {
    const selectedId = Template.instance() && Template.instance().selected.get();
    if (this && this.client && selectedId) {
      const { clientId, schema } = _.find(this.client.clientVersions,
          (item) => item.clientId === selectedId);
      return getClientVersion(this.client, clientId, schema);
    }
    const currentClientId = Router.current().params._id;
    const client = Clients.findOne(currentClientId);
    return client;
  },
});
