/**
 * Created by udit on 14/12/15.
 */
if ( typeof Accounts.onCreateUser != 'undefined' ) {

	Accounts.onCreateUser( function ( options, user ) {

		if ( user.services ) {

			var service = _.keys( user.services )[0];
			var email;
			switch ( service ) {
				case 'password':
					email = ( user.emails != undefined ) ? user.emails.address : '';
					break;
				default:
					email = user.services[service].email;
					break;
			}

			if ( ! email ) {
				return user;
			}

			// see if any existing user has this email address, otherwise create new
			var existingUser = Meteor.users.findOne( {'emails.address': email} );

			if ( ! existingUser ) {
				if ( ! user.emails ) {
					user.emails = [ { address: email, verified: true } ];
				}
				return user;
			}

			// precaution, these will exist from accounts-password if used
			if ( ! existingUser.services ) {
				existingUser.services = {resume: {loginTokens: []}};
			}
			if ( ! existingUser.services.resume ) {
				existingUser.services.resume = {loginTokens: []};
			}

			if ( ! existingUser.emails ) {
				existingUser.emails = [ { address: email, verified: true } ];
			}

			// copy accross new service info
			existingUser.services[service] = user.services[service];
			if ( user.services.resume && user.services.resume.loginTokens && user.services.resume.loginTokens[0] ) {
				existingUser.services.resume.loginTokens.push( user.services.resume.loginTokens[0] );
			}

			// even worse hackery
			Meteor.users.remove( {_id: existingUser._id} ); // remove existing record
			return existingUser;                          // record is re-inserted
		}
	} );

}
