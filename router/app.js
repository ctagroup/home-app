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
    controller: 'HomeController',
  }
);

Router.route(
  '/not-enough-permission', {
    name: 'notEnoughPermission',
    template: 'notEnoughPermission',
    controller: 'HomeController',
  }
);
/**
 * Client Routes
 */
// Router.route(
//   '/clients', {
//     name: 'searchClient',
//     template: 'searchClient',
//     controller: 'HomeController',
//   }
// );
// Router.route(
//   '/clients/new', {
//     name: 'createClient',
//     template: 'createClient',
//     controller: 'HomeController',
//     waitOn() {
//       // waitOn makes sure that this publication is ready before rendering your template
//       return Meteor.subscribe('options');
//     },
//   }
// );
// // Router.route(
// //   '/clients/:_id', {
// //     name: 'viewClient',
// //     template: 'viewClient',
// //     controller: 'HomeController',
// //     data() {
// //       let client = '';
// //       if (this.params.query && this.params.query.isHMISClient) {
// //         client = Session.get('currentHMISClient') || false;
// //       } else {
// //         const clientID = this.params._id;
// //         client = clients.findOne({ _id: clientID });
// //       }
// //       return client;
// //     },
// //   }
// // );
// Router.onBeforeAction(
//   function clientAction() {
//     let recentClients = Session.get('recentClients') || [];
//     const that = this;
//
//     if (this.params.query && this.params.query.isHMISClient && this.params.query.link) {
//       Meteor.call(
//         'getHMISClient', this.params._id, this.params.query.link, (err, res) => {
//           const rez = res;
//           if (err) {
//             logger.log(err);
//             that.render('clientNotFound');
//             return;
//           }
//
//           if (rez) {
//             rez.personalId = rez.clientId;
//             rez._id = rez.clientId;
//             rez.isHMISClient = true;
//             Session.set('currentHMISClient', rez);
//
//             const recentClientsIDs = recentClients.map((client) => client._id);
//
//             if (recentClientsIDs.indexOf(that.params._id) === - 1) {
//               const route = Router.routes.viewClient;
//               const data = {
//                 _id: that.params._id,
//                 name: `${rez.firstName.trim()} ${rez.lastName.trim()}`,
//                 url: route.path(
//                   { _id: that.params._id },
//                { query: `isHMISClient=true&link=${encodeURIComponent(this.params.query.link)}` }
//                 ),
//               };
//               recentClients.push(data);
//               recentClients = $.unique(recentClients);
//               Session.set('recentClients', recentClients);
//             }
//           } else {
//             that.render('clientNotFound');
//           }
//         }
//       );
//     } else {
//       const client = clients.findOne({ _id: this.params._id });
//
//       if (client && client._id) {
//         const recentClientsIDs = recentClients.map((client) => client._id);
//
//         if (recentClientsIDs.indexOf(this.params._id) === - 1) {
//           const route = Router.routes.viewClient;
//           const data = {
//             _id: this.params._id,
//             name: `${client.firstName.trim()} ${client.lastName.trim()}`,
//             url: route.path({ _id: this.params._id }),
//           };
//           recentClients.push(data);
//           recentClients = $.unique(recentClients);
//           Session.set('recentClients', recentClients);
//         }
//       } else {
//         this.render('clientNotFound');
//         return;
//       }
//     }
//
//     this.next();
//   }, {
//     only: ['viewClient', 'editClient', 'LogSurvey', 'LogSurveyResponse'],
//   }
// );
// Router.route(
//   '/clients/:_id/edit', {
//     name: 'editClient',
//     template: 'editClient',
//     controller: 'HomeController',
//     data() {
//       const clientID = this.params._id;
//       return clients.findOne({ _id: clientID });
//     },
//   }
// );

// // Router.route(
// //   '/clients/:_id/logSurvey', {
// //     name: 'LogSurvey',
// //     template: 'LogSurvey',
// //     controller: 'HomeController',
// //   }
// // );
// Router.route(
//   '/clients/:_id/logsurvey/:survey_id', {
//     name: 'LogSurveyResponse',
//     template: 'LogSurveyResponse',
//     controller: 'HomeController',
//     data() {
//       let client = '';
//       if (this.params.query && this.params.query.isHMISClient) {
//         client = Session.get('currentHMISClient') || false;
//       } else {
//         const clientID = this.params._id;
//         client = clients.findOne({ _id: clientID });
//       }
//
//       const surveyID = this.params.survey_id;
//       logger.log(`survey ${surveyID}`);
//       const survey = surveys.findOne({ _id: surveyID });
//
//       return { client, survey };
//     },
//   }
// );
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
    controller: 'HomeController',
  }
);
Router.route(
  '/terms-of-use', {
    name: 'termsOfUse',
    template: 'termsOfUse',
    controller: 'HomeController',
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
