import { Clients } from '/imports/api/clients/clients';
import { AppController } from './controllers';


Router.route('adminDashboardhousingMatchView', {
  path: '/housingMatch',
  template: 'AdminDashboardView',
  controller: AppController,
});

Router.route('adminDashboardhousingMatchNew', {
  path: '/housingMatch/new',
  template: 'AdminDashboardNew',
  controller: AppController,
  waitOn() {
    /*
      Meteor.subscribe('collectionDoc', collectionName, HomeUtils.parseID(this.params._id));
      if (collection.templates && collection.templates.edit && collection.templates.edit.waitOn) {
        collection.templates.edit.waitOn();
      }
    */
    return [];
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

Router.route('adminDashboardhousingMatchEdit', {
  path: '/housingMatch/edit',
  template: 'AdminDashboardEdit',
  controller: AppController,
  action() {
    this.render();
  },
  waitOn() {
    return [];
  },
  onBeforeAction() {

  },
  onAfterAction() {

  },
  data() {
    return {
      admin_collection: Clients,
    };
  },
});
