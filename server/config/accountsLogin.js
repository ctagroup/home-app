/**
 * Created by udit on 12/12/15.
 */

// Set up login services
Meteor.startup(function() {
	// Add Google configuration entry
	ServiceConfiguration.configurations.update( {
			service: "google"
		}, {
			$set: {
				clientId: "522168810796-5sb1su89f044ra1vi64u5t9cg35e0d7u.apps.googleusercontent.com",
				client_email: "desaiuditd@gmail.com",
				secret: "ueekmRmJipAeyjmfeRBE2nAh"
			}
		}, {
			upsert: true
		}
	);

	// Add Facebook configuration entry
	ServiceConfiguration.configurations.update( {
		service: "facebook"
	}, {
		$set: {
			appId: "1698808713665458",
			secret: "3c77849ac0fd07b9d7ed6d90b3e346a1"
		}
	}, {
		upsert: true
	} );

	//Add Twitter configuration entry
	//Accounts.loginServiceConfiguration.update( {
	//	service: "twitter"
	//}, {
	//	$set: {
	//		consumerKey: "KEbv2Zf8iSeRmCBjw0HWPpcaL",
	//		secret: "2aeO1mlXbOG0iK7gqodCSPXfP3SZocuzX5JUGN4yIBYTuma4qS"
	//	}
	//}, {
	//	upsert: true
	//} );

	//Accounts.loginServiceConfiguration.remove( { service: "twitter" } );
} );