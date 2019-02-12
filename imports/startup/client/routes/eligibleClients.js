import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Router.route('adminDashboardeligibleClientsView', {
  path: '/eligibleClients',
  template: 'eligibleClientsListView',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('eligibleClients.list');
  },
  data() {
    return {
      title: 'Eligible Clients',
      subtitle: 'View',
    };
  },
});
