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
	'termsOfUse'
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

Router.route( '/app/client/single-client/', {
	name: 'clientProfile',
	template: 'clientProfile',
	controller: 'HomeAppController'
} );

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
