@AdminTables = {}

adminTablesDom = '<"box"<"box-header"<"box-toolbar"<"pull-left"<lf>><"pull-right"p>>><"box-body table-responsive"t>>'

adminEditButton = {
	data: '_id'
	title: 'Edit'
	createdCell: (node, cellData, rowData) ->
		$(node).html(Blaze.toHTMLWithData Template.adminEditBtn, {_id: cellData})
	width: '40px'
	orderable: false
}
adminDelButton = {
	data: '_id'
	title: 'Delete'
	createdCell: (node, cellData, rowData) ->
		$(node).html(Blaze.toHTMLWithData Template.adminDeleteBtn, {_id: cellData})
	width: '40px'
	orderable: false
}

adminEditDelButtons = [
	adminEditButton,
	adminDelButton
]

defaultColumns = () -> [
  data: '_id',
  title: 'ID'
]

adminTablePubName = (collection) ->
	"admin_tabular_#{collection}"

adminCreateTables = (collections) ->
	_.each AdminConfig?.collections, (collection, name) ->
		_.defaults collection, {
			showEditColumn: true
			showDelColumn: true
		}

		columns = _.map collection.tableColumns, (column) ->
			if column.template
				createdCell = (node, cellData, rowData) ->
					$(node).html ''
					Blaze.renderWithData(Template[column.template], {value: cellData, doc: rowData}, node)

			data: column.name
			title: column.label
			createdCell: createdCell
			width: column.width if column.width?
			searchable: column.searchable if column.searchable?
			render: column.render if column.render?

		if columns.length == 0
			columns = defaultColumns()

		if collection.showEditColumn
			columns.push(adminEditButton)
		if collection.showDelColumn
			columns.push(adminDelButton)

		changeSelector = '';
		if collection.changeSelector
			changeSelector = collection.changeSelector

		AdminTables[name] = new Tabular.Table
			name: name
			collection: adminCollectionObject(name)
			pub: collection.children and adminTablePubName(name)
			sub: collection.sub
			columns: columns
			extraFields: collection.extraFields
			dom: adminTablesDom
			changeSelector: changeSelector

adminCreateRoutes = (collections) ->
	_.each collections, adminCreateRouteView
	_.each collections,	adminCreateRouteNew
	_.each collections, adminCreateRouteEdit

adminCreateRouteView = (collection, collectionName) ->
	Router.route "adminDashboard#{collectionName}View",
		adminCreateRouteViewOptions collection, collectionName

adminCreateRouteViewOptions = (collection, collectionName) ->
  options =
    path: "/admin/#{collectionName}"
    template: "AdminDashboardView"
    controller: "AdminController"
    data: ->
      admin_table: AdminTables[collectionName]
    action: ->
      @render()
    onAfterAction: ->
      Session.set 'admin_title', if ( typeof collection.label != 'undefined' ) then collection.label else collectionName
      Session.set 'admin_subtitle', 'View'
      Session.set 'admin_collection_name', collectionName
      collection.routes?.view?.onAfterAction

  if (collection.templates && collection.templates.view && collection.templates.view.waitOn)
    options.waitOn = collection.templates.view.waitOn;

  _.defaults options, collection.routes?.view

adminCreateRouteNew = (collection, collectionName) ->
	Router.route "adminDashboard#{collectionName}New",
		adminCreateRouteNewOptions collection, collectionName

adminCreateRouteNewOptions = (collection, collectionName) ->
	options =
		path: "/admin/#{collectionName}/new"
		template: "AdminDashboardNew"
		controller: "AdminController"
		action: ->
			@render()
		onAfterAction: ->
			Session.set 'admin_title', AdminDashboard.collectionLabel collectionName
			Session.set 'admin_subtitle', 'Create new'
			Session.set 'admin_collection_page', 'new'
			Session.set 'admin_collection_name', collectionName
			collection.routes?.new?.onAfterAction
		data: ->
			admin_collection: adminCollectionObject collectionName
	_.defaults options, collection.routes?.new

adminCreateRouteEdit = (collection, collectionName) ->
	Router.route "adminDashboard#{collectionName}Edit",
		adminCreateRouteEditOptions collection, collectionName

adminCreateRouteEditOptions = (collection, collectionName) ->
	options =
		path: "/admin/#{collectionName}/:_id/edit"
		template: "AdminDashboardEdit"
		controller: "AdminController"
		waitOn: ->
			Meteor.subscribe 'adminCollectionDoc', collectionName, parseID(@params._id)
			collection.routes?.edit?.waitOn
		action: ->
			@render()
		onAfterAction: ->
			doc = adminCollectionObject(collectionName).findOne _id : parseID(@params._id)
			if ( collectionName == 'users' && doc && doc.emails && doc.emails[0] && doc.emails[0].address )
				subtitle = doc.emails[0].address
			else
				subtitle = @params._id
			Session.set 'admin_title', AdminDashboard.collectionLabel collectionName
			Session.set 'admin_subtitle', 'Edit: ' + subtitle
			Session.set 'admin_collection_page', 'edit'
			Session.set 'admin_collection_name', collectionName
			Session.set 'admin_id', parseID(@params._id)
			Session.set 'admin_doc', doc
			collection.routes?.edit?.onAfterAction
		data: ->
			admin_collection: adminCollectionObject collectionName
	_.defaults options, collection.routes?.edit

adminPublishTables = (collections) ->
	_.each collections, (collection, name) ->
		if not collection.children then return undefined
		Meteor.publishComposite adminTablePubName(name), (tableName, ids, fields) ->
			check tableName, String
			check ids, Array
			check fields, Match.Optional Object

			extraFields = _.reduce collection.extraFields, (fields, name) ->
				fields[name] = 1
				fields
			, {}
			_.extend fields, extraFields

			@unblock()

			find: ->
				@unblock()
				adminCollectionObject(name).find {_id: {$in: ids}}, {fields: fields}
			children: collection.children

Meteor.startup ->
	adminCreateTables AdminConfig?.collections
	adminCreateRoutes AdminConfig?.collections
	adminPublishTables AdminConfig?.collections if Meteor.isServer
