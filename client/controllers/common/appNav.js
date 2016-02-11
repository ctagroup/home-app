/**
 * Created by udit on 12/12/15.
 */
Template.appNav.events( {
	'click .js-logout': function() {
		if ( Meteor.userId() ) {
			AccountsTemplates.logout();
		}
	}
} );

Template.appNav.helpers( {
	currentUserGravatar: function() {
		var user = Meteor.user();
		var email = user && user.emails && user.emails[0].address;
		//email = Email.normalize( email );
		return '<img class="avatar small" src="' + Gravatar.imageUrl( email ) + '" />';
	},
	currentUserFullName: function() {
		var user = Meteor.user();
		// ToDo: Check for FName & LNAme / Display Name first
		var email = user && user.emails && user.emails[0].address;
		return email;
	}
} );
