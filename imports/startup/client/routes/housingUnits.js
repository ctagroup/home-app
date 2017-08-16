import { Clients } from '/imports/api/clients/clients';
import { HousingUnitsCache, ProjectsCache } from '/imports/both/cached-subscriptions';
import { AppController } from './controllers';

const title = 'Housing Units';

Router.route('adminDashboardhousingUnitsView', {
  path: '/housingUnits',
  template: 'housingUnitsListView',
  controller: AppController,
  waitOn() {
    return HousingUnitsCache.subscribe('housingUnits');
  },
  data() {
    return {
      title,
      subtitle: 'View',
    };
  },
});

Router.route('adminDashboardhousingUnitsNew', {
  path: '/housingUnits/new',
  template: 'AdminDashboardNew',
  controller: AppController,
  waitOn() {
    return ProjectsCache.subscribe('projects');
  },
  action() {
    this.render();
  },
  onBeforeAction() {
    /*
    if (collection.userRoles) {
      if (!Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
        Router.go('notEnoughPermission');
      }
    }
    */
    this.next();
  },
  onAfterAction() {
    /*
    Session.set('admin_title', HomeDashboard.collectionLabel(collectionName));
    Session.set('admin_subtitle', 'Create new');
    Session.set('admin_collection_page', 'new');
    Session.set('admin_collection_name', collectionName);
    if (collection.templates && collection.templates.new
        && collection.templates.new.onAfterAction) {
      collection.templates.new.onAfterAction();
    }
    */
  },
  data() {
    return {
      admin_collection: Clients,
    };
  },
});

Router.route('adminDashboardhousingUnitsEdit', {
  path: '/housingUnits/:_id/edit',
  template: 'AdminDashboardEdit',
  controller: AppController,
  action() {
    this.render();
  },
  waitOn() {
    const _id = Router.current().params._id;
    return [
      Meteor.subscribe('singleHousingUnit', _id),
      ProjectsCache.subscribe('projects'),
    ];
  },
  data() {
    const _id = Router.current().params._id;
    return housingUnits.findOne({ _id });
  },
});
