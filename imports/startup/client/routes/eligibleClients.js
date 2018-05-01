import { AppController } from './controllers';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';


Router.route('adminDashboardeligibleClientsView', {
  path: '/eligibleClients',
  template: 'eligibleClientsListView',
  controller: AppController,
  authorize: {
    allow() {
      return ableToAccess(Meteor.userId(), 'viewEligibleClients');
    },
  },
  waitOn() {
    return [Meteor.subscribe('rolePermissions.all'), Meteor.subscribe('eligibleClients.list')];
  },
  data() {
    return {
      title: 'Eligible Clients',
      subtitle: 'View',
    };
  },
});
