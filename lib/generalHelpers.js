/**
 * Created by udit on 29/04/16.
 */
HomeHelpers = {
	getOtherRoles: function ( userId ) {
		const homeRolesCollection = adminCollectionObject("homeRoles");
		let defaultHomeRoles = homeRolesCollection.find({}).fetch();

		const userRoles = HomeHelpers.getUserRoles(userId);
		defaultHomeRoles = _.map(defaultHomeRoles, function ( role ) {
			return role.title;
		});

		defaultHomeRoles = _.filter(defaultHomeRoles, function(role) {
			if (userRoles.indexOf(role) == -1) {
				return true;
			}
			return false;
		});

		return defaultHomeRoles;
	},
	getUserRoles: function (userId) {
		var currentRoles = new Array();
		var homeRolesCollection = adminCollectionObject("homeRoles");
		var defaultHomeRoles = homeRolesCollection.find({}).fetch();
		var rolePermissionsCollection = adminCollectionObject("rolePermissions");

		for( i in defaultHomeRoles ) {

			var rolePermissions = rolePermissionsCollection.find({role:defaultHomeRoles[i].title, value:true}).fetch();
			var flag = true;

			for( j in rolePermissions ) {
				if ( ! Roles.userIsInRole(userId, rolePermissions[j].permission) ) {
					flag = false;
					break;
				}
			}

			if ( flag ) {
				currentRoles.push(defaultHomeRoles[i].title);
			}

		}

		return currentRoles;
	}
};
