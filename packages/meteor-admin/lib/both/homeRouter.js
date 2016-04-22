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
		Session.set('admin_title', 'Settings');
		Session.set('admin_collection_name', 'settings');
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
		Session.set('admin_collection_name', 'selectQuestions');
		Session.set('admin_collection_page', '');
	},
	data: function() {
		var surveyID = this.params._id;
		var surveyCollection = adminCollectionObject("surveys");
		return surveyCollection.findOne({_id:surveyID});
	}
});

Router.route( "previewSurvey", {
	path: "/admin/surveys/:_id/preview",
	template: "previewSurvey",
	controller: "AdminController",
	action: function() {
		this.render();
	},
	onAfterAction: function() {
		Session.set('admin_title', 'Survey Preview');
		Session.set('admin_collection_name', 'preview');
		Session.set('admin_collection_page', '');
	},
	data: function() {
		var surveyID = this.params._id;
		var surveyCollection = adminCollectionObject("surveys");
		return surveyCollection.findOne({_id:surveyID});
	}
} );
// Router.route("clientProfile",{
// 	path:'/admin/clientProfile',
// 	template: 'clientProfile',
// 	controller: 'AdminController',
// 	action: function() {
// 		this.render();
// 	}
//
// });
// Router.route("clientProfileView",{
// 	path:'/admin/clientProfileView/:_id/view',
// 	template: 'clientProfileView',
// 	controller: 'AdminController',
// 	action: function() {
// 		this.render();
// 	},
// 	onAfterAction: function() {
// 		Session.set('admin_title', 'Client Profile');
// 		Session.set('admin_collection_name', 'clientProfileView');
// 		Session.set('admin_collection_page', '');
// 	},
// 	data: function(){
// 		var clientInfoID = this.params._id;
// 		var clientInfoCollection = adminCollectionObject("clientInfo");
// 		return clientInfoCollection.findOne({_id:clientInfoID});
//
// 	}
// });
// Router.route("clientProfileEdit",{
// 	path:'/admin/clientProfileEdit/:_id/edit',
// 	template: 'clientProfileEdit',
// 	controller: 'AdminController',
// 	action: function() {
// 		this.render();
// 	},
// 	onAfterAction: function() {
// 		Session.set('admin_title', 'Edit Profile');
// 		Session.set('admin_collection_name', 'clientProfileEdit');
// 		Session.set('admin_collection_page', '');
// 	},
// 	data: function(){
// 		var clientInfoID = this.params._id;
// 		var clientInfoCollection = adminCollectionObject("clientInfo");
// 		return clientInfoCollection.findOne({_id:clientInfoID});
//
// 	}
// })

