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
      logger.log(e)
      logger.log(r)
			$('#admin-delete-modal').modal('hide')

Template.AdminHeader.events
	'click .btn-sign-out': () ->
		Meteor.logout ->
			Router.go('/')
