/**
 * Created by udit on 28/07/16.
 */

Router.route(
  'openingScript', {
    path: '/openingScript',
    template: 'openingScript',
    controller: 'AdminController',
    action() {
      this.render();
    },
    onAfterAction() {
      Session.set('admin_title', 'Opening Script');
      Session.set('admin_collection_name', 'openingScript');
      Session.set('admin_collection_page', '');
    },
  }
);
