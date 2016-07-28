/**
 * Created by udit on 28/07/16.
 */

Router.route(
  'roleManager', {
    path: '/roles',
    template: 'roleManager',
    controller: 'AdminController',
    action() {
      this.render();
    },
    onAfterAction() {
      Session.set('admin_title', 'Role Manager');
      Session.set('admin_collection_name', 'roles');
      Session.set('admin_collection_page', '');
    },
  }
);
