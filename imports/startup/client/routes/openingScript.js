import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import { AppController } from './controllers';
import '/imports/ui/openingScript/openingScript';

Router.route(
  'openingScript', {
    path: '/openingScript',
    template: Template.openingScript,
    controller: AppController,
    waitOn() {
      return Meteor.subscribe('rolePermissions.all');
    },
    authorize: {
      allow() {
        return ableToAccess(Meteor.userId(), 'accessOpeningScript');
      },
    },
    data() {
      return {
        title: 'Opening script',
      };
    },
  }
);
