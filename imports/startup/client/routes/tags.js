import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import '/imports/ui/tags/tagListView';

Router.route(
  'tagList', {
    path: '/tags',
    template: Template.tagListView,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('tags.all'),
      ];
    },
    data() {
      return {
        title: 'Tags',
        subtitle: 'List',
      };
    },
  }
);
