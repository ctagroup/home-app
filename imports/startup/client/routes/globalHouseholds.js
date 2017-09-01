import { GlobalHouseholdsCache } from '/imports/both/cached-subscriptions';
import { GlobalHouseholdsAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';


Router.route('adminDashboardglobalHouseholdsView', {
  path: '/globalHouseholds',
  template: 'globalHouseholdListView',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), GlobalHouseholdsAccessRoles);
    },
  },
  waitOn() {
    return GlobalHouseholdsCache.subscribe('globalHouseholds.list');
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
      return Roles.userIsInRole(Meteor.userId(), GlobalHouseholdsAccessRoles);
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
      return Roles.userIsInRole(Meteor.userId(), GlobalHouseholdsAccessRoles);
    },
  },
  waitOn() {
    const _id = Router.current().params._id;
    return Meteor.subscribe('globalHouseholds.one', _id);
  },
  data() {
    return {
      title: 'Households',
      subtitle: 'Edit',
    };
  },
});
