Meteor.methods
	adminInsertDoc: (doc,collection)->
		check arguments, [Match.Any]
		if Roles.userIsInRole this.userId, ['create_'+collection]
			this.unblock()
			result = adminCollectionObject(collection).insert doc

			return result

	adminUpdateDoc: (modifier,collection,_id)->
		check arguments, [Match.Any]
		if Roles.userIsInRole this.userId, ['edit_'+collection]
			this.unblock()
			console.log(modifier);
			result = adminCollectionObject(collection).update {_id:_id},modifier
			return result

#  adminRemoveDoc: (collection, _id)->
#    check arguments, [Match.Any]
##		if Roles.userIsInRole this.userId, ['delete_'+collection]
#    if collection == 'Users'
#      return Meteor.users.remove { _id: _id }
#    else
## global[collection].remove {_id:_id}
#      return adminCollectionObject(collection).remove { _id: _id }


	adminNewUser: (doc) ->
		check arguments, [Match.Any]
		if Roles.userIsInRole this.userId, ['create_user']
			emails = doc.email.split(',')
			_.each emails, (email)->
				user = {}
				user.email = email
				unless doc.chooseOwnPassword
					user.password = doc.password

				_id = Accounts.createUser user

				if doc.sendPassword and AdminConfig.fromEmail?
					Email.send
						to: user.email
						from: AdminConfig.fromEmail
						subject: 'Your account has been created'
						html: 'You\'ve just had an account created for ' + Meteor.absoluteUrl() + ' with password ' + doc.password

				if not doc.sendPassword
					Accounts.sendEnrollmentEmail _id

	adminUpdateUser: (modifier,_id)->
		check arguments, [Match.Any]
		if Roles.userIsInRole this.userId, ['edit_user']
			this.unblock()
			console.log(modifier);
			result = Meteor.users.update {_id:_id}, modifier
			return result

	adminSendResetPasswordEmail: (doc)->
		check arguments, [Match.Any]
		if Roles.userIsInRole this.userId, ['reset_user_password']
			console.log 'Changing password for user ' + doc._id
			Accounts.sendResetPasswordEmail(doc._id)

	adminChangePassword: (doc)->
		check arguments, [Match.Any]
		if Roles.userIsInRole this.userId, ['reset_user_password']
			console.log 'Changing password for user ' + doc._id
			Accounts.setPassword(doc._id, doc.password)
			label: 'Email user their new password'

	adminCheckAdmin: ->
		check arguments, [Match.Any]
		user = Meteor.users.findOne(_id:this.userId)
		developerPermissions = AdminConfig.defaultRolePermissions['Developer'];
		if this.userId and !Roles.userIsInRole(this.userId, developerPermissions) and user.emails and (user.emails.length > 0)
			email = user.emails[0].address
			if typeof Meteor.settings.adminEmails != 'undefined'
				adminEmails = Meteor.settings.adminEmails
				if adminEmails.indexOf(email) > -1
					console.log 'Adding admin user: ' + email
					Roles.addUsersToRoles this.userId, developerPermissions, Roles.GLOBAL_GROUP
			else if typeof AdminConfig != 'undefined' and typeof AdminConfig.adminEmails == 'object'
				adminEmails = AdminConfig.adminEmails
				if adminEmails.indexOf(email) > -1
					console.log 'Adding admin user: ' + email
					Roles.addUsersToRoles this.userId, developerPermissions, Roles.GLOBAL_GROUP
			else if this.userId == Meteor.users.findOne({},{sort:{createdAt:1}})._id
				console.log 'Making first user admin: ' + email
				Roles.addUsersToRoles this.userId, developerPermissions, Roles.GLOBAL_GROUP

	adminSetCollectionSort: (collection, _sort) ->
		check arguments, [Match.Any]
		global.AdminPages[collection].set
			sort: _sort
