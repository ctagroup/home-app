import { AppController } from './controllers';


Router.route('adminDashboardeligibleClientsView', {
  path: '/eligibleClients',
  template: 'eligibleClientsListView',
  controller: AppController,
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
