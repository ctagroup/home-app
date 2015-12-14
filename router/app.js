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
 * Home Routes
 */
Router.route( '/', {
	name: 'root',
	template: 'home',
} );
Router.route( '/home', {
	name: 'home',
	template: 'home',
} );

/**
 * Accounts Routes
 */
AccountsTemplates.configureRoute( 'changePwd', {
	name: 'changePwd',
	path: '/change-password',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'enrollAccount', {
	name: 'enrollAccount',
	path: '/enroll-account',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'forgotPwd', {
	name: 'forgotPwd',
	path: '/forgot-password',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'resetPwd', {
	name: 'resetPwd',
	path: '/reset-password',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'signIn', {
	name: 'signIn',
	path: '/login',
	template: 'login',
	redirect: '/app'
} );
AccountsTemplates.configureRoute( 'signUp', {
	name: 'signUp',
	path: '/register',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'verifyEmail', {
	name: 'verifyEmail',
	path: '/verify-email',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'resendVerificationEmail', {
	name: 'resendVerificationEmail',
	path: '/send-again',
	template: 'login'
} );

/**
 * App Routes
 */
Router.route( '/app', {
	name: 'appRoot',
	template: 'appDashboard'
});
Router.route( '/app/dashboard', {
	name: 'appDashboard',
	template: 'appDashboard'
});

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
	template: 'privacy'
} );
Router.route( '/terms-of-use', {
	name: 'termsOfUse',
	template: 'termsOfUse'
} );
