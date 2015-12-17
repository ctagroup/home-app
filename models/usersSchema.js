/**
 * Created by udit on 14/12/15.
 */
users = Meteor.users;

Schemas.users = new SimpleSchema( {
	email: {
		type: String,
		label: 'Email address'
	},
	chooseOwnPassword: {
		type: Boolean,
		label: 'Let this user choose their own password with an email',
		defaultValue: true
	},
	password: {
		type: String,
		label: 'Password',
		optional: true
	},
	sendPassword: {
		type: Boolean,
		label: 'Send this user their password by email',
		optional: true
	}
} );

//users.attachSchema( Schemas.users );
