@AdminController = RouteController.extend
	layoutTemplate: 'AdminLayout'
	waitOn: ->
		[
			Meteor.subscribe 'collectionsCount'
		]
	onBeforeAction: ->
		Session.set 'adminSuccess', null
		Session.set 'adminError', null

		Session.set 'admin_title', ''
		Session.set 'admin_subtitle', ''
		Session.set 'admin_collection_page', null
		Session.set 'admin_collection_name', null
		Session.set 'admin_id', null
		Session.set 'admin_doc', null

		if not Roles.userIsInRole Meteor.userId(), ['view_admin']
			Meteor.call 'adminCheckAdmin'
			if typeof AdminConfig?.nonAdminRedirectRoute == 'string'
				Router.go AdminConfig.nonAdminRedirectRoute

		@next()


Router.route "adminDashboard",
	path: "/dashboard"
	template: "AdminDashboard"
	controller: "AdminController"
	action: ->
		@render()
	onAfterAction: ->
		Session.set 'admin_title', 'Dashboard'
		Session.set 'admin_collection_name', ''
		Session.set 'admin_collection_page', ''
