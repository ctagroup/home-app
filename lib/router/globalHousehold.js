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
    onAfterAction() {
      Session.set('admin_title', 'Add Clients To Household');
      Session.set('admin_collection_name', 'clients');
      Session.set('admin_collection_page', '');
    },
    data() {
    },
  }
);
