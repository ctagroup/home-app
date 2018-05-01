import { AppController } from './controllers';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';


Router.route('adminDashboardhousingMatchView', {
  path: '/housingMatch',
  template: 'housingMatchListView',
  controller: AppController,
  authorize: {
    allow() {
      return ableToAccess(Meteor.userId(), 'accessHouseMatch');
    },
  },
  waitOn() {
    return [
      Meteor.subscribe('rolePermissions.all'),
      Meteor.subscribe('housingUnits.list', false),
      // Meteor.subscribe('projects.all'),
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
