/**
 * Created by udit on 10/02/16.
 */
Template.AdminRoleManager.events(
	{
		'click .js-update': function(e) {
			e.preventDefault();
			var serializeInput = $("#js-frm-role-manager" ).serializeArray();
			$("#js-frm-role-manager :input" ).attr("disabled", true);
			Meteor.call("updateRolePermissions", serializeInput, function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
				$("#js-frm-role-manager :input" ).attr("disabled", false);
			} );
		},
		'click .js-reset': function(e) {
			e.preventDefault();
			Meteor.call("resetRolePermissions", function ( error, result ) {
				if ( error ) {
					console.log(error);
				} else {
					console.log(result);
				}
			} );
		}
	}
);
