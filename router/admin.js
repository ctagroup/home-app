/**
 * Created by udit on 13/12/15.
 */

/**
 * Admin Routes
 */
//Router.route( '/admin', {
//	name: 'adminRoot',
//	template: 'adminDashboard'
//} );
Router.route( '/admin/dashboard', function() {
	Router.go( '/admin' );
} );

