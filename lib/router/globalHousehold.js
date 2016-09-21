/**
 * Created by Anush-PC on 8/1/2016.
 */
/**
 * Created by udit on 06/02/16.
 */

Router.route(
  'addClients', {
    path: '/globalHousehold/new/addClients',
    template: 'globalHouseholdAddClients',
    controller: 'AppController',
    action() {
      this.render();
    },
    onBeforeAction() {
      const collection = HomeConfig.collections.globalHousehold;
      if (collection.userRoles) {
        if (! Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', 'Add Clients To Household');
      Session.set('admin_collection_name', 'clients');
      Session.set('admin_collection_page', '');
    },
    data() {
    },
  }
);
