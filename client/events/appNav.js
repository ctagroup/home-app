/**
 * Created by udit on 20/06/16.
 */

Template.appNav.events(
	{
		'click .js-logout': function() {
			if ( Meteor.userId() ) {
				AccountsTemplates.logout();
			}
		}
	}
);
