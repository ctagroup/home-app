import { Clients } from '/imports/api/clients/clients';
import { AppController } from './controllers';


Router.route('adminDashboardsurveysView', {
  path: '/surveys',
  template: 'AdminDashboardView',
  controller: AppController,
});

Router.route('adminDashboardsurveysNew', {
  path: '/surveys/new',
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

Router.route('adminDashboardsurveysEdit', {
  path: '/surveys/edit',
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

Router.route(
  'selectSurveyQuestion', {
    path: '/surveys/:_id/selectQuestions',
    template: 'selectQuestions',
    controller: 'AppController',
    action() {
      this.render();
    },
    onBeforeAction() {
      const collection = HomeConfig.collections.surveys;
      if (collection.userRoles) {
        if (!Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
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
    controller: 'AppController',
    action() {
      this.render();
    },
    onBeforeAction() {
      const collection = HomeConfig.collections.surveys;
      if (collection.userRoles) {
        if (!Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', 'Survey Preview');
      Session.set('admin_collection_name', 'preview');
      Session.set('admin_collection_page', '');
    },
    data() {
      const surveyID = this.params._id;
      return surveys.findOne({ _id: surveyID });
    },
  }
);
