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

	// Add HMIS configuration entry
	ServiceConfiguration.configurations.update( {
		service: "HMIS",
	}, {
		$set: {
			hmisAPIEndpoints: AdminConfig.hmisAPIEndpoints,
			appId: "16631CFE-6909-4AC1-B4EB-57902AC7AF0A",
			appSecret: "appSecret"
		}
	}, {
		upsert: true
	} );

} );
