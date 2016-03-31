Package.describe({
  name: "desaiuditd:admin",
  summary: "A complete admin dashboard solution",
  version: "1.2.3",
  git: "https://github.com/desaiuditd/meteor-admin"
});

Package.on_use(function(api){

  both = ['client','server']

  api.versionsFrom('METEOR@1.0');

  api.use(
    ['iron:router@1.0.9',
    'coffeescript',
    'check',
    'underscore',
    'reactive-var',
    'aldeed:collection2@2.5.0',
    'aldeed:autoform@5.5.1',
    'aldeed:template-extension@3.4.3',
    'alanning:roles@1.2.13',
    'raix:handlebar-helpers@0.2.5',
    'reywood:publish-composite@1.4.2',
    'momentjs:moment@2.10.6',
    'aldeed:tabular@1.4.0',
    'meteorhacks:unblock@1.1.0',
    'zimme:active-route@2.3.2',
    'mfactory:admin-lte@0.0.2'
    ],
    both);

  api.use(['fourseven:scss@3.4.1','session','jquery','templating'],'client')

  api.use(['email'],'server')

  api.add_files([
    'lib/both/AdminDashboard.coffee',
    'lib/both/router.coffee',
    'lib/both/utils.coffee',
    'lib/both/startup.coffee',
    'lib/both/collections.coffee',
    'lib/both/homeRouter.js',
    'lib/both/homeStartup.js'
    ], both);

  api.add_files([
    'lib/client/html/admin_templates.html',
    'lib/client/html/survey_templates.html',
    'lib/client/html/question_templates.html',
    'lib/client/html/admin_widgets.html',
    'lib/client/html/admin_layouts.html',
    'lib/client/html/admin_sidebar.html',
    'lib/client/html/admin_header.html',
	'lib/client/stylesheets/style.scss',
	'lib/client/stylesheets/_admin.scss',
	'lib/client/stylesheets/_settings.scss',
	'lib/client/stylesheets/_survey.scss',
    'lib/client/js/admin_layout.js',
    'lib/client/js/helpers.coffee',
    'lib/client/js/homeEvents.js',
    'lib/client/js/homeHelpers.js',
    'lib/client/js/homeAutoForm.js',
    'lib/client/js/templates.coffee',
    'lib/client/js/events.coffee',
    'lib/client/js/slim_scroll.js',
    'lib/client/js/autoForm.coffee'
    ], 'client');

  api.add_files([
    'lib/server/publish.coffee',
    'lib/server/methods.coffee',
    'lib/server/homeMethods.js',
    'lib/server/homePublish.js'
    ], 'server');

  api.export('AdminDashboard',both)
});
