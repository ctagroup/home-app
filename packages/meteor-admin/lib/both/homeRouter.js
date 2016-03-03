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
