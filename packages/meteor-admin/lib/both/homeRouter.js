/**
 * Created by udit on 06/02/16.
 */
Router.route("adminRoleManager", {
	path: "/admin/roles",
	template: "AdminRoleManager",
	controller: "AdminController",
	action: function() {
		this.render();
	},
	onAfterAction: function() {
		Session.set('admin_title', 'Role Manager');
		Session.set('admin_collection_name', '');
		Session.set('admin_collection_page', '');
	}
});
