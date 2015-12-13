/**
 * Created by udit on 12/12/15.
 */

/**
 * Application Routes
 */

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
 * Admin Routes
 */
Router.route( '/admin', {
	name: 'adminRoot',
	template: 'adminDashboard'
} );
Router.route( '/admin/dashboard', {
	name: 'adminDashboard',
	template: 'adminDashboard'
} );

/**
 * Ensure User Login for templates
 */
Router.plugin( 'ensureSignedIn', {
	except: [
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
		'terms-of-use'
	]
} );

/**
 * Misc Routes
 * */
Router.route( '/privacy', function() {
	this.render( 'privacy' );
} );
Router.route( '/terms-of-use', function() {
	this.render( 'termsOfUse' );
} )
