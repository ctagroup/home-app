import { AppController } from './controllers';
import { ClientsAccessRoles } from '/imports/config/permissions';

Router.route('adminDashboardsearchClientsView', {
  path: '/clients/searchClientsView/:searchKey',
  template: 'viewAllClients',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
    },
  },
  data() {
    return {
      title: 'Search Clients',
      subtitle: 'View',
    };
  },
});
