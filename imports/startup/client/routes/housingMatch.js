import { AppController } from './controllers';


Router.route('adminDashboardhousingMatchView', {
  path: '/housingMatch',
  template: 'housingMatchListView',
  controller: AppController,
  waitOn() {
    return [
      Meteor.subscribe('housingUnits.list', false),
      // Meteor.subscribe('projects.list'),
      Meteor.subscribe('housingMatch.list'),
    ];
  },
  data() {
    return {
      title: 'Housing Match',
      subtitle: 'View',
    };
  },
});
