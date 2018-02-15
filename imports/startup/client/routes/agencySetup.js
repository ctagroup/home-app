import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import '/imports/ui/agencySetup/agencySetup';

Router.route(
  'agencySetup', {
    path: '/agencySetup',
    template: Template.agencySetup,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('projects.list'),
        Meteor.subscribe('users.all'),
      ];
    },
    data() {
      return {
        title: 'Agency Setup',
      };
    },
  }
);
