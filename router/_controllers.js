/**
 * Created by udit on 28/07/16.
 */

AdminController = RouteController.extend({
  layoutTemplate: 'AdminLayout',
  waitOn() {
    return [Meteor.subscribe('collectionsCount')];
  },
  onBeforeAction() {
    Session.set('adminSuccess', null);
    Session.set('adminError', null);
    Session.set('admin_title', '');
    Session.set('admin_subtitle', '');
    Session.set('admin_collection_page', null);
    Session.set('admin_collection_name', null);
    Session.set('admin_id', null);
    Session.set('admin_doc', null);

    Meteor.call('checkDevUser');

    this.next();
  },
});
