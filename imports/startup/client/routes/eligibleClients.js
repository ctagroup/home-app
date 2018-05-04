import { AppController } from './controllers';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';

import FeatureDecisions from '/imports/both/featureDecisions';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
let checkPermissions;
if (featureDecisions.roleManagerEnabled()) {
  checkPermissions = (userId) => ableToAccess(userId, 'viewEligibleClients');
} else {
  checkPermissions = (userId) => Roles.userIsInRole(userId, DefaultAdminAccessRoles);
}

Router.route('adminDashboardeligibleClientsView', {
  path: '/eligibleClients',
  template: 'eligibleClientsListView',
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    return [Meteor.subscribe('eligibleClients.list')];
  },
  data() {
    return {
      title: 'Eligible Clients',
      subtitle: 'View',
    };
  },
});
