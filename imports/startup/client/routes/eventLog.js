import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';

import '/imports/ui/eventLog/eventsListView';


Router.route('events', {
  path: '/events',
  template: 'eventsListView',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('events.all');
  },
  data() {
    return {
      title: 'System Events',
      subtitle: 'View',
    };
  },
});
