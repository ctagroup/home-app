/**
 * Created by udit on 12/12/15.
 */

/**
 * Public Routes without login
 */
const publicRoutes = [
  'root',
  'home',
  'changePwd',
  'enrollAccount',
  'forgotPwd',
  'resetPwd',
  'signIn',
  'signUp',
  'verifyEmail',
  'resendVerificationEmail',
  'privacy',
  'termsOfUse',
  'notEnoughPermission',
];

/**
 * Route Controller to check on users.
 */
HomeAppController = RouteController.extend(
  {
    onBeforeAction() {
      if (Meteor.userId() && ! Roles.userIsInRole(Meteor.userId(), 'view_admin')) {
        Meteor.call('adminCheckAdmin');
      }
      this.next();
    },
  }
);

HomeAppSurveyorController = HomeAppController.extend(
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
    controller: 'HomeAppController',
  }
);
Router.route(
  '/home', {
    name: 'home',
    template: 'home',
    controller: 'HomeAppController',
  }
);

/**
 * Accounts Routes
 */
AccountsTemplates.configureRoute(
  'signIn', {
    name: 'signIn',
    path: '/login',
    template: 'login',
    redirect: '/app/clients',
    controller: 'HomeAppController',
  }
);
AccountsTemplates.configureRoute(
  'signUp', {
    name: 'signUp',
    path: '/register',
    template: 'login',
    controller: 'HomeAppController',
  }
);

/**
 * App Routes
 */
Router.route(
  '/app', {
    name: 'appRoot',
    template: 'appDashboard',
    controller: 'HomeAppController',
  }
);
Router.route(
  '/app/dashboard', {
    name: 'appDashboard',
    template: 'appDashboard',
    controller: 'HomeAppController',
  }
);

Router.route(
  '/not-enough-permission', {
    name: 'notEnoughPermission',
    template: 'notEnoughPermission',
    controller: 'HomeAppController',
  }
);
/**
 * Client Routes
 */
Router.route(
  '/app/clients', {
    name: 'searchClient',
    template: 'searchClient',
    controller: 'HomeAppController',
  }
);
Router.route(
  '/app/clients/new', {
    name: 'createClient',
    template: 'createClient',
    controller: 'HomeAppController',
    waitOn: function(){
      // waitOn makes sure that this publication is ready before rendering your template
      return Meteor.subscribe('options');
    },
  }
);
Router.route(
  '/app/clients/:_id', {
    name: 'viewClient',
    template: 'viewClient',
    controller: 'HomeAppController',
    data() {
      let client = '';
      if (this.params.query && this.params.query.isHMISClient) {
        client = Session.get('currentHMISClient') || false;
      } else {
        const clientInfoID = this.params._id;
        const clientInfoCollection = adminCollectionObject('clientInfo');
        client = clientInfoCollection.findOne({ _id: clientInfoID });
      }
      return client;
    },
  }
);
Router.onBeforeAction(
  function clientAction() {
    let recentClients = Session.get('recentClients') || [];
    const that = this;

    if (this.params.query && this.params.query.isHMISClient && this.params.query.link) {
      Meteor.call(
        'getHMISClient', this.params.query.link, (err, res) => {
          const rez = res;
          if (err) {
            logger.log(err);
            that.render('clientNotFound');
            return;
          }

          if (rez) {
            rez.personalId = rez.clientId;
            rez._id = rez.clientId;
            rez.isHMISClient = true;
            Session.set('currentHMISClient', rez);

            const recentClientsIDs = recentClients.map((client) => client._id);

            if (recentClientsIDs.indexOf(that.params._id) === - 1) {
              const route = Router.routes.viewClient;
              const data = {
                _id: that.params._id,
                name: `${rez.firstName.trim()} ${rez.lastName.trim()}`,
                url: route.path(
                  { _id: that.params._id },
                  { query: `isHMISClient=true&link=${encodeURIComponent(this.params.query.link)}` }
                ),
              };
              recentClients.push(data);
              recentClients = $.unique(recentClients);
              Session.set('recentClients', recentClients);
            }
          } else {
            that.render('clientNotFound');
          }
        }
      );
    } else {
      const clientInfoCollection = adminCollectionObject('clientInfo');
      const clientInfo = clientInfoCollection.findOne({ _id: this.params._id });

      if (clientInfo && clientInfo._id) {
        const recentClientsIDs = recentClients.map((client) => client._id);

        if (recentClientsIDs.indexOf(this.params._id) === - 1) {
          const route = Router.routes.viewClient;
          const data = {
            _id: this.params._id,
            name: `${clientInfo.firstName.trim()} ${clientInfo.lastName.trim()}`,
            url: route.path({ _id: this.params._id }),
          };
          recentClients.push(data);
          recentClients = $.unique(recentClients);
          Session.set('recentClients', recentClients);
        }
      } else {
        this.render('clientNotFound');
        return;
      }
    }

    this.next();
  }, {
    only: ['viewClient', 'editClient', 'LogSurvey', 'LogSurveyResponse'],
  }
);
Router.route(
  '/app/clients/:_id/edit', {
    name: 'editClient',
    template: 'editClient',
    controller: 'HomeAppController',
    data() {
      const clientInfoID = this.params._id;
      const clientInfoCollection = adminCollectionObject('clientInfo');
      return clientInfoCollection.findOne({ _id: clientInfoID });
    },
  }
);

Router.route(
  '/app/clients/:_id/logSurvey', {
    name: 'LogSurvey',
    template: 'LogSurvey',
    controller: 'HomeAppController',
  }
);
Router.route(
  '/app/clients/:_id/logsurvey/:survey_id', {
    name: 'LogSurveyResponse',
    template: 'LogSurveyResponse',
    controller: 'HomeAppController',
    data() {
      let client = '';
      if (this.params.query && this.params.query.isHMISClient) {
        client = Session.get('currentHMISClient') || false;
      } else {
        const clientInfoID = this.params._id;
        const clientInfoCollection = adminCollectionObject('clientInfo');
        client = clientInfoCollection.findOne({ _id: clientInfoID });
      }

      const surveyID = this.params.survey_id;
      logger.log(`survey ${surveyID}`);
      const surveysCollection = adminCollectionObject('surveys');
      const survey = surveysCollection.findOne({ _id: surveyID });

      return { client, survey };
    },
  }
);
Router.route(
  '/app/LogSurveyView/:_id', {
    name: 'LogSurveyView',
    template: 'LogSurveyView',
    controller: 'HomeAppController',
    data() {
      const responseID = this.params._id;
      const responsesCollection = adminCollectionObject('responses');
      return responsesCollection.findOne({ _id: responseID });
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
    controller: 'HomeAppController',
  }
);
/**
 * Ensure User Login for templates
 */
Router.plugin(
  'ensureSignedIn', {
    except: publicRoutes,
  }
);

/**
 * Misc Routes
 * */
Router.route(
  '/privacy', {
    name: 'privacy',
    template: 'privacy',
    controller: 'HomeAppController',
  }
);
Router.route(
  '/terms-of-use', {
    name: 'termsOfUse',
    template: 'termsOfUse',
    controller: 'HomeAppController',
  }
);

/**
 * Chat Routes
 */

Router.route(
  '/app/chat/', {
    name: 'chat',
    template: 'chat',
    controller: 'HomeAppController',
  }
);
