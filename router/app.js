/**
 * Created by udit on 12/12/15.
 */

/**
 * Application Routes
 */

/**
 * Public Routes without login
 */
var publicRoutes = [
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
    'notEnoughPermission'
];

/**
 * Route Controller to check on users.
 */
HomeAppController = RouteController.extend(
	{
		onBeforeAction: function() {
			if ( Meteor.userId() && ! Roles.userIsInRole( Meteor.userId(), 'view_admin' ) ) {
				Meteor.call( 'adminCheckAdmin' );
			}
			this.next();
		}
	}
);

HomeAppSurveyorController = HomeAppController.extend(
	{
		onBeforeAction: function () {
			if ( Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'Surveyor') ) {
				// Allow Route for Surveyors
			} else {
				Router.go('notEnoughPermission');
				return;
			}
			this.next();
		}
	}
);

/**
 * Home Routes
 */
Router.route( '/', {
	name: 'root',
	template: 'home',
	controller: 'HomeAppController'
} );
Router.route( '/home', {
	name: 'home',
	template: 'home',
	controller: 'HomeAppController'
} );

/**
 * Accounts Routes
 */
AccountsTemplates.configureRoute( 'changePwd', {
	name: 'changePwd',
	path: '/change-password',
	template: 'login',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'enrollAccount', {
	name: 'enrollAccount',
	path: '/enroll-account',
	template: 'login',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'forgotPwd', {
	name: 'forgotPwd',
	path: '/forgot-password',
	template: 'login',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'resetPwd', {
	name: 'resetPwd',
	path: '/reset-password',
	template: 'login',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'signIn', {
	name: 'signIn',
	path: '/login',
	template: 'login',
	redirect: '/app',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'signUp', {
	name: 'signUp',
	path: '/register',
	template: 'login',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'verifyEmail', {
	name: 'verifyEmail',
	path: '/verify-email',
	template: 'login',
	controller: 'HomeAppController'
} );
AccountsTemplates.configureRoute( 'resendVerificationEmail', {
	name: 'resendVerificationEmail',
	path: '/send-again',
	template: 'login',
	controller: 'HomeAppController'
} );

/**
 * App Routes
 */
Router.route( '/app', {
	name: 'appRoot',
	template: 'appDashboard',
	controller: 'HomeAppController'
});
Router.route( '/app/dashboard', {
	name: 'appDashboard',
	template: 'appDashboard',
	controller: 'HomeAppController'
});

Router.route('/not-enough-permission', {
	name: 'notEnoughPermission',
	template: 'notEnoughPermission',
	controller: 'HomeAppController'
} );

Router.route( '/app/client/', {
	name: 'clientSearch',
	template: 'clientSearch',
	controller: 'HomeAppController',
} );
Router.route('/app/LogSurvey/',{
	name:'LogSurvey',
	template: 'LogSurvey',
	controller: 'HomeAppController'
});
Router.route('/app/LogSurvey/:_id',{
	name:'LogSurveyResponse',
	template: 'LogSurveyResponse',
	controller: 'HomeAppController',
	data: function(){
		var surveyID = this.params._id;
		console.log("suvey"+surveyID);
		var surveysCollection = adminCollectionObject("surveys");
		return surveysCollection.findOne({_id:surveyID});

	}
});

// Router.route( '/app/client/single-client/', {
// 	name: 'clientProfile',
// 	template: 'clientProfile',
// 	controller: 'HomeAppSurveyorController'
// } );

Router.route('/app/client/single-client/',{
	name:'clientProfile',
	template: 'clientProfile',
	controller: 'HomeAppController',
});
Router.route('/app/client/single-client/:_id/view',{
	name: 'clientProfileView',
	template: 'clientProfileView',
	controller: 'HomeAppController',
	data: function(){
		var clientInfoID = this.params._id;
		var clientInfoCollection = adminCollectionObject("clientInfo");
		return clientInfoCollection.findOne({_id:clientInfoID});

	}
});
 Router.route('/app/client/single-client/:_id/edit',{
	name:'clientProfileEdit',
	template: 'clientProfileEdit',
	controller: 'HomeAppController',
	data: function(){
		var clientInfoID = this.params._id;
		var clientInfoCollection = adminCollectionObject("clientInfo");
		return clientInfoCollection.findOne({_id:clientInfoID});

	}
})

/**
 * Ensure User Login for templates
 */
Router.plugin( 'ensureSignedIn', {
	except: publicRoutes
} );

/**
 * Misc Routes
 * */
Router.route( '/privacy', {
	name: 'privacy',
	template: 'privacy',
	controller: 'HomeAppController'
} );
Router.route( '/terms-of-use', {
	name: 'termsOfUse',
	template: 'termsOfUse',
	controller: 'HomeAppController'
} );

/**
 * Chat Routes
 */

 Router.route( '/app/chat/', {
	name: 'chat',
	template: 'chat',
	controller: 'HomeAppController'
} );
