import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import '/imports/ui/openingScript/openingScript';

Router.route(
  'openingScript', {
    path: '/openingScript',
    template: Template.openingScript,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    data() {
      return {
        title: 'Opening script',
      };
    },
  }
);
