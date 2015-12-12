/**
 * Created by udit on 12/12/15.
 */

/**
 * Application Routes
 */

/**
 * Home Routes
 */
Router.route( '/', function () {
	this.render( 'home' );
});
Router.route( '/home', function() {
	this.render( 'home' );
} );

/**
 * Accounts Routes
 */
AccountsTemplates.configureRoute( 'changePwd', {
	path: '/change-password',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'enrollAccount', {
	path: '/enroll-account',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'forgotPwd', {
	path: '/forgot-password',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'resetPwd', {
	path: '/reset-password',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'signIn', {
	path: '/login',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'signUp', {
	path: '/register',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'verifyEmail', {
	path: '/verify-email',
	template: 'login'
} );
AccountsTemplates.configureRoute( 'resendVerificationEmail', {
	path: '/send-again',
	template: 'login'
} )

/**
 * Misc Routes
 * */
Router.route( '/privacy', function() {
	this.render( 'privacy' );
} );
Router.route( '/terms-of-use', function() {
	this.render( 'termsOfUse' );
} )
