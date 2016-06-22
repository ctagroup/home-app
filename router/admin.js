/**
 * Created by udit on 06/02/16.
 */
Router.route(
  '/admin/dashboard', () => {
    Router.go('/admin');
  }
);

Router.route(
  'adminRoleManager', {
    path: '/admin/roles',
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
    path: '/admin/settings',
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
    path: '/admin/surveys/:_id/selectQuestions',
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
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.findOne({ _id: surveyID });
    },
  }
);

Router.route(
  'previewSurvey', {
    path: '/admin/surveys/:_id/preview',
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
      const surveyCollection = adminCollectionObject('surveys');
      return surveyCollection.findOne({ _id: surveyID });
    },
  }
);
