import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';

Router.route('adminDashboardsearchClientsView', {
  path: '/clients/searchClientsView/:searchKey',
  template: 'viewAllClients',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  data() {
    return {
      title: 'Search Clients',
      subtitle: 'View',
    };
  },
});
