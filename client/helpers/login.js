/**
 * Created by udit on 12/12/15.
 */
Template.login.helpers( {
	atDisabled: function() {
		return AccountsTemplates.disabled();
	},
	atClass: function() {
		return AccountsTemplates.disabled() ? 'disabled' : 'active';
	}
} );
