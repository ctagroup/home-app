/**
 * Created by udit on 12/12/15.
 */

HomeAppSurveyorController = HomeController.extend(
  {
    onBeforeAction() {
      if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'Surveyor')) {
        // Allow Route for Surveyors
      } else {
        Router.go('notEnoughPermission');
        return;
      }
      this.next();
    },
  }
);

/**
 * Home Routes
 */
Router.route(
  '/', {
    name: 'root',
    template: 'home',
    controller: 'ContentController',
  }
);

Router.route(
  '/not-enough-permission', {
    name: 'notEnoughPermission',
    template: 'notEnoughPermission',
    controller: 'AppController',
  }
);

Router.route(
  '/LogSurveyView/:_id', {
    name: 'LogSurveyView',
    template: 'LogSurveyView',
    controller: 'HomeController',
    data() {
      const responseID = this.params._id;
      return responses.findOne({ _id: responseID });
    },
  }
);
/**
 * Survey status Routes
 */
Router.route(
  '/app/surveys/', {
    name: 'surveyStatus',
    template: 'surveyStatus',
    controller: 'HomeController',
  }
);

/**
 * Misc Routes
 * */
Router.route(
  '/privacy', {
    name: 'privacy',
    template: 'privacy',
    controller: 'ContentController',
  }
);
Router.route(
  '/terms-of-use', {
    name: 'termsOfUse',
    template: 'termsOfUse',
    controller: 'ContentController',
  }
);

/**
 * Chat Routes
 */

Router.route(
  '/chat/', {
    name: 'chat',
    template: 'chat',
    controller: 'HomeController',
  }
);
