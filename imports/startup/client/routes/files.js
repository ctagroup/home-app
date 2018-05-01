import { Clients } from '/imports/api/clients/clients';
import FeatureDecisions from '/imports/both/featureDecisions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import { fullName } from '/imports/api/utils';
import { AppController } from './controllers';
import '/imports/ui/files/filesList';
import '/imports/ui/files/filesNew';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
if (featureDecisions.isMc211App()) {
  Router.route('filesList', {
    path: '/files',
    template: Template.filesList,
    controller: AppController,
    authorize: {
      allow() {
        return ableToAccess(Meteor.userId(), 'accessFiles');
      },
    },
    waitOn() {
      const { clientId, schema } = this.params.query;
      if (clientId && schema) {
        return [
          Meteor.subscribe('clients.one', clientId, schema),
          Meteor.subscribe('files.all', clientId),
          Meteor.subscribe('rolePermissions.all'),
        ];
      }
      return [Meteor.subscribe('rolePermissions.all'), Meteor.subscribe('files.all', clientId)];
    },
    data() {
      const { clientId } = this.params.query;
      const client = Clients.findOne(clientId);

      return {
        title: 'Files',
        subtitle: client ? `${fullName(client)}` : 'List',
        client,
      };
    },
  });

  Router.route('filesNew', {
    path: '/files/new',
    template: Template.filesNew,
    controller: AppController,
    authorize: {
      allow() {
        return ableToAccess(Meteor.userId(), 'accessFiles');
      },
    },
    waitOn() {
      const { clientId, schema } = this.params.query;
      return [
        Meteor.subscribe('rolePermissions.all'),
        Meteor.subscribe('clients.one', clientId, schema),
      ];
    },
    data() {
      const { clientId } = this.params.query;
      const client = Clients.findOne(clientId) || {};
      return {
        title: 'Files',
        subtitle: 'New',
        client,
      };
    },
  });
}
