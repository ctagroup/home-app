/**
 * Created by udit on 06/02/16.
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
    if (!Roles.userIsInRole(Meteor.userId(), ['view_admin'])) {
      Meteor.call('adminCheckAdmin');
      if (AdminConfig && AdminConfig.nonAdminRedirectRoute) {
        Router.go(AdminConfig.nonAdminRedirectRoute);
      }
    }
    this.next();
  },
});

Router.route(
  'adminRoleManager', {
    path: '/roles',
    template: 'AdminRoleManager',
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

Router.route(
  'adminSettings', {
    path: '/settings',
    template: 'AdminSettings',
    controller: 'AdminController',
    action() {
      this.render();
    },
    onAfterAction() {
      Session.set('admin_title', 'Settings');
      Session.set('admin_collection_name', 'settings');
      Session.set('admin_collection_page', '');
    },
  }
);

Router.route(
  'selectSurveyQuestion', {
    path: '/surveys/:_id/selectQuestions',
    template: 'selectQuestions',
    controller: 'AdminController',
    action() {
      this.render();
    },
    onAfterAction() {
      Session.set('admin_title', 'Select Questions');
      Session.set('admin_collection_name', 'selectQuestions');
      Session.set('admin_collection_page', '');
    },
    data() {
      const surveyID = this.params._id;
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      return surveyCollection.findOne({ _id: surveyID });
    },
  }
);

Router.route(
  'previewSurvey', {
    path: '/surveys/:_id/preview',
    template: 'previewSurvey',
    controller: 'AdminController',
    action() {
      this.render();
    },
    onAfterAction() {
      Session.set('admin_title', 'Survey Preview');
      Session.set('admin_collection_name', 'preview');
      Session.set('admin_collection_page', '');
    },
    data() {
      const surveyID = this.params._id;
      const surveyCollection = HomeUtils.adminCollectionObject('surveys');
      return surveyCollection.findOne({ _id: surveyID });
    },
  }
);

Router.route('adminDashboard', {
  path: '/dashboard',
  template: 'AdminDashboard',
  controller: 'AdminController',
  action() {
    return this.render();
  },
  onAfterAction() {
    Session.set('admin_title', 'Dashboard');
    Session.set('admin_collection_name', '');
    Session.set('admin_collection_page', '');
  },
});
