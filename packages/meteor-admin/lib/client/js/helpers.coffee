Template.registerHelper('AdminTables', AdminTables);

adminCollections = ->
	collections = {}

	if typeof AdminConfig != 'undefined'  and typeof AdminConfig.collections == 'object'
		collections = AdminConfig.collections

	_.map collections, (obj, key) ->
		obj = _.extend obj, {name: key}
		obj = _.defaults obj, {label: key, icon: 'plus', color: 'primary'}
		obj = _.extend obj,
			viewPath: Router.path "adminDashboard#{key}View"
			newPath: Router.path "adminDashboard#{key}New"

UI.registerHelper 'AdminConfig', ->
	AdminConfig if typeof AdminConfig != 'undefined'

UI.registerHelper 'admin_skin', ->
	AdminConfig?.skin or 'blue'

UI.registerHelper 'admin_collections', adminCollections

UI.registerHelper 'admin_collection_name', ->
	Session.get 'admin_collection_name'

UI.registerHelper 'admin_current_id', ->
	Session.get 'admin_id'

UI.registerHelper 'admin_current_doc', ->
	Session.get 'admin_doc'

UI.registerHelper 'admin_is_users_collection', ->
	Session.get('admin_collection_name') == 'Users'

UI.registerHelper 'admin_sidebar_items', ->
	AdminDashboard.sidebarItems

UI.registerHelper 'admin_collection_items', ->
	items = []
	_.each AdminDashboard.collectionItems, (fn) =>
		item = fn @name, '/admin/' + @name
		if item?.title and item?.url
			items.push item
	items

UI.registerHelper 'admin_omit_fields', ->
	if typeof AdminConfig.autoForm != 'undefined' and typeof AdminConfig.autoForm.omitFields == 'object'
		global = AdminConfig.autoForm.omitFields
	if not Session.equals('admin_collection_name','Users') and typeof AdminConfig != 'undefined' and typeof AdminConfig.collections[Session.get 'admin_collection_name'].omitFields == 'object'
		collection = AdminConfig.collections[Session.get 'admin_collection_name'].omitFields
	if typeof global == 'object' and typeof collection == 'object'
		_.union global, collection
	else if typeof global == 'object'
		global
	else if typeof collection == 'object'
		collection

UI.registerHelper 'AdminSchemas', ->
	AdminDashboard.schemas

UI.registerHelper 'adminGetSkin', ->
	if typeof AdminConfig.dashboard != 'undefined' and typeof AdminConfig.dashboard.skin == 'string'
		AdminConfig.dashboard.skin
	else
		'blue'

UI.registerHelper 'adminGetUsers', ->
	Meteor.users

UI.registerHelper 'adminGetUserSchema', ->
	if _.has(AdminConfig, 'userSchema')
		schema = AdminConfig.userSchema
	else if typeof Meteor.users._c2 == 'object'
		schema = Meteor.users.simpleSchema()

	return schema

UI.registerHelper 'adminCollectionLabel', (collection)->
	AdminDashboard.collectionLabel(collection) if collection?

UI.registerHelper 'adminCollectionCount', (collection)->
	if collection == 'Users'
		Meteor.users.find().count()
	else
		AdminCollectionsCount.findOne({collection: collection})?.count

UI.registerHelper 'adminTemplate', (collection, mode)->
	if typeof AdminConfig?.collections?[collection]?.templates != 'undefined'
		AdminConfig.collections[collection].templates[mode]

UI.registerHelper 'adminGetCollection', (collection)->
	_.find adminCollections(), (item) -> item.name == collection

UI.registerHelper 'adminWidgets', ->
	if typeof AdminConfig.dashboard != 'undefined' and typeof AdminConfig.dashboard.widgets != 'undefined'
		AdminConfig.dashboard.widgets

UI.registerHelper 'adminUserEmail', (emails) ->
	if emails && emails[0] && emails[0].address
		emails[0].address
