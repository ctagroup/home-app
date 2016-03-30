/**
 * Created by udit on 06/02/16.
 */
Meteor.startup(function() {
	if (Meteor.isServer) {

		// Create Default home Roles
		var homeRoles = Meteor.call("getAllHomeRoles");
		if ( homeRoles.length == 0 ) {
			Meteor.call("generateDefaultHomeRoles");
		}

		// Create Default Permissions - Roles in case of Meteor Roles Package
		var homePermissions = Meteor.call("getAllHomePermissions");
		if ( homePermissions.length == 0 ) {
			Meteor.call("generateHomePermissions");
		}

		// Map Roles with Capabilities
		var homeRolePermissions = Meteor.call("getAllRolePermissions");
		if ( homeRolePermissions.length == 0 ) {
			Meteor.call("generateHomeRolePermissions");
		}

		// Check Roles of Developer Users
		_.each(AdminConfig.adminEmails, function ( email, i ) {
			var devUser = Meteor.users.find({emails: {"$elemMatch" : {address:email}}} ).fetch();
			if ( devUser.length > 0 ) {
				if ( ! Roles.userIsInRole( devUser[0]._id, "Developer") ) {
					Meteor.call("addUserToRole", devUser[0]._id, "Developer");
				}
			}
		});
	}

	if ( Meteor.isClient ) {
		Meteor.subscribe("users", function () {
			AdminDashboard.addSidebarItem("Role Manager", AdminDashboard.path('/roles'), { icon: 'user-secret' });
			if ( Roles.userIsInRole( Meteor.user(), "manage_settings" ) ) {
				AdminDashboard.addSidebarItem("Settings", AdminDashboard.path('/settings'), { icon: 'cogs' });
			}
		});

		Meteor.subscribe("roles");
		Meteor.subscribe("homeRoles");
		Meteor.subscribe("rolePermissions");
		Meteor.subscribe("options");
		Meteor.subscribe("surveys");
		Meteor.subscribe("questions");
		Meteor.subscribe("surveyQuestionsMaster");
	}
});
