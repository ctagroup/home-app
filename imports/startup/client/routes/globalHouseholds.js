import { GlobalHouseholdsCache } from '/imports/both/cached-subscriptions';
import { GlobalHouseholdsAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';

import FeatureDecisions from '/imports/both/featureDecisions';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
let checkPermissions;
if (featureDecisions.roleManagerEnabled()) {
  checkPermissions = (userId) => ableToAccess(userId, 'accessHouseholds');
} else {
  checkPermissions = (userId) => Roles.userIsInRole(userId, GlobalHouseholdsAccessRoles);
}


Router.route('adminDashboardglobalHouseholdsView', {
  path: '/globalHouseholds',
  template: 'globalHouseholdListView',
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    return [
      GlobalHouseholdsCache.subscribe('globalHouseholds.list'),
    ];
  },
  data() {
    return {
      title: 'Households',
      subtitle: 'View',
    };
  },
});

Router.route('adminDashboardglobalHouseholdsNew', {
  path: '/globalHouseholds/new',
  template: 'globalHouseholdCreateView',
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  data() {
    return {
      title: 'Households',
      subtitle: 'New',
    };
  },
});

Router.route('adminDashboardglobalHouseholdsEdit', {
  path: '/globalHouseholds/:_id/edit',
  template: 'globalHouseholdEditView',
  controller: AppController,
  authorize: {
    allow() {
      return checkPermissions(Meteor.userId());
    },
  },
  waitOn() {
    const _id = Router.current().params._id;
    return [Meteor.subscribe('globalHouseholds.one', _id)];
  },
  data() {
    return {
      title: 'Households',
      subtitle: 'Edit',
    };
  },
});
