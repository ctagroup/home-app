import { GlobalHouseholdsCache } from '/imports/both/cached-subscriptions';
import { AppController } from './controllers';


Router.route('adminDashboardglobalHouseholdsView', {
  path: '/globalHouseholds',
  template: 'globalHouseholdListView',
  controller: AppController,
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
