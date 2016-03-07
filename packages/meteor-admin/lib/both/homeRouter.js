/**
 * Created by udit on 06/02/16.
 */
Router.route( '/admin/dashboard', function() {
	Router.go( '/admin' );
} );

Router.route("adminRoleManager", {
	path: "/admin/roles",
	template: "AdminRoleManager",
	controller: "AdminController",
	action: function() {
		this.render();
	},
	onAfterAction: function() {
		Session.set('admin_title', 'Role Manager');
		Session.set('admin_collection_name', 'roles');
		Session.set('admin_collection_page', '');
	}
});

Router.route("adminSettings", {
	path: "/admin/settings",
	template: "AdminSettings",
	controller: "AdminController",
	action: function() {
		this.render();
	},
	onAfterAction: function() {
		Session.set('admin_title', 'Select Questions');
		Session.set('admin_collection_name', 'selectQuestions');
		Session.set('admin_collection_page', '');
	}
});

Router.route( "selectSurveyQuestion", {
	path: "/admin/surveys/:_id/selectQuestions",
	template: "selectQuestions",
	controller: "AdminController",
	action: function() {
		this.render();
	},
	onAfterAction: function() {
		Session.set('admin_title', 'Select Questions');
		Session.set('admin_collection_name', 'settings');
		Session.set('admin_collection_page', '');
	},
	data: function() {
		var surveyID = this.params._id;
		var surveyCollection = adminCollectionObject("surveys");
		return surveyCollection.findOne({_id:surveyID});
	}
});
