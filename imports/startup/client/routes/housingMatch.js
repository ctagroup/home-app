import { AppController } from './controllers';


Router.route('adminDashboardhousingMatchView', {
  path: '/housingMatch',
  template: 'housingMatchListView',
  controller: AppController,
  waitOn() {
    return [
      Meteor.subscribe('housingMatch.list'),
      Meteor.subscribe('housingUnits.list'),
    ];
  },
  data() {
    return {
      title: 'Housing Match',
      subtitle: 'View',
    };
  },
});
