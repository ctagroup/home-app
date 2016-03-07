/**
 * Created by udit on 10/02/16.
 */
Template.AdminRoleManager.helpers( {
	getHomeRoles: function() {
		return homeRoles.find({}).fetch();
	},
	getPermissions: function() {
		var permissions = Roles.getAllRoles().fetch();
		var roles = homeRoles.find({}).fetch();
		roles = $.map(roles, function(role, i) {
			return role.title;
		});
		permissions = $.grep(permissions, function(p) {
			return $.inArray( p.name, roles) < 0;
		});
		return permissions;
	},
	isPermissionInRole: function(permission) {
		var rolePermissionsCollection = adminCollectionObject("rolePermissions");
		var result = rolePermissionsCollection.find({role:this.title,permission:permission, value:true} ).fetch();
		if ( result.length > 0 ) {
			return 'checked';
		}
		return "";
	}
} );

Template.AdminSettings.helpers( {
	getAdminSettings: function() {
		var settings = {};

		settings.hmisAPI = {};

		var optionsCollection = adminCollectionObject("options");
		var trustedAppID = optionsCollection.find({option_name:"trustedAppID"} ).fetch();
		if(trustedAppID.length > 0 && typeof trustedAppID[0].option_value != 'undefined') {
			settings.hmisAPI.trustedAppID = trustedAppID[0].option_value;
		} else {
			settings.hmisAPI.trustedAppID = "";
		}

		return settings;

	}
} );

UI.registerHelper("currentUserCan", function(cap) {
	return Roles.userIsInRole(Meteor.userId(), cap);
});

Session.setDefault('editing_surveys',null);

Template.registerHelper('formatDate', function(date) {
	return moment(new Date()).format('MM/DD/YYYY');
});

Template.surveyViewTemplate.helpers(
	{
		surveyList: function() {
			var surveyCollection = adminCollectionObject("surveys");
			return surveyCollection.find();
		}
	}
);

Template.surveyForm.helpers(
	{
		surveyManager: function() {
			var surveyCollection = adminCollectionObject("surveys");
			return surveyCollection.findOne({_id:Session.get('editing_surveys')});
		},
		editing_surveys: function() {
			return Session.get('editing_surveys');
		}
	}
);
