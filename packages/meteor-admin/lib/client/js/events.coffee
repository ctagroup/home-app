Template.AdminLayout.events
	'click .btn-delete': (e,t) ->
		_id = $(e.target).attr('doc')
		if Session.equals 'admin_collection_name', 'Users'
			Session.set 'admin_id', _id
			Session.set 'admin_doc', Meteor.users.findOne(_id)
		else
			Session.set 'admin_id', parseID(_id)
			Session.set 'admin_doc', adminCollectionObject(Session.get('admin_collection_name')).findOne(parseID(_id))

Template.AdminDeleteModal.events
	'click #confirm-delete': () ->
		collection = Session.get 'admin_collection_name'
		_id = Session.get 'admin_id'
		Meteor.call 'adminRemoveDoc', collection, _id, (e,r)->
			$('#admin-delete-modal').modal('hide')

Template.AdminDashboardusersEdit.events
	'click .btn-add-role': (e,t) ->
		console.log 'adding user'
		$('.home-spinner').removeClass("hide").addClass('show');
		Meteor.call 'addUserToRole', $(e.target).attr('user'), $(e.target).attr('role'), (error, result) ->
			$('.home-spinner').removeClass("show").addClass('hide');
	'click .btn-remove-role': (e,t) ->
		console.log 'removing user'
		$('.home-spinner').removeClass("hide").addClass('show');
		Meteor.call 'removeUserFromRole', $(e.target).attr('user'), $(e.target).attr('role'), (error, result) ->
			$('.home-spinner').removeClass("show").addClass('hide');

Template.AdminHeader.events
	'click .btn-sign-out': () ->
		Meteor.logout ->
			Router.go('/')
