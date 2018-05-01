import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';

import FeatureDecisions from '/imports/both/featureDecisions';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
let checkPermissions;
if (featureDecisions.roleManagerEnabled()) {
  checkPermissions = (userId) => ableToAccess(userId, 'accessHouseMatch');
} else {
  checkPermissions = (userId) => Roles.userIsInRole(userId, DefaultAdminAccessRoles);
}


Router.route('adminDashboardhousingMatchView', {
  path: '/housingMatch',
  template: 'housingMatchListView',
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    return [
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
