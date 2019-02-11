import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Router.route('adminDashboardsearchClientsView', {
  path: '/clients/view_all/:searchKey',
  template: 'viewAllClient',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  waitOn() {
    var term = this.params.searchKey;
    return [
		Meteor.subscribe('search', term)
	]
  },
  data() {
    return {
      title: 'Search Clients',
      subtitle: 'View',
    };
  },
});
