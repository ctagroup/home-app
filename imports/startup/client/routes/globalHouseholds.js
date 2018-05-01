import { GlobalHouseholdsCache } from '/imports/both/cached-subscriptions';
import { AppController } from './controllers';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';


Router.route('adminDashboardglobalHouseholdsView', {
  path: '/globalHouseholds',
  template: 'globalHouseholdListView',
  controller: AppController,
  authorize: {
    allow() {
      return ableToAccess(Meteor.userId(), 'accessHouseholds');
    },
  },
  waitOn() {
    return [
      Meteor.subscribe('rolePermissions.all'),
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
  waitOn() {
    return Meteor.subscribe('rolePermissions.all');
  },
  authorize: {
    allow() {
      return ableToAccess(Meteor.userId(), 'accessHouseholds');
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
      return ableToAccess(Meteor.userId(), 'accessHouseholds');
    },
  },
  waitOn() {
    const _id = Router.current().params._id;
    return [Meteor.subscribe('rolePermissions.all'), Meteor.subscribe('globalHouseholds.one', _id)];
  },
  data() {
    return {
      title: 'Households',
      subtitle: 'Edit',
    };
  },
});
