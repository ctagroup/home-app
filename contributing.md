# Coding Standards

We are following [Airbnb JavaScript Style Guide](http://airbnb.io/javascript/).

# How to follow Coding Standards in this project

- First go through the Airbnb Style Guide thoroughly.
- Install [ESLint](http://eslint.org/) with this command `npm install -g eslint`.
- Run `npm run lint` command to check the coding standards everytime before `git commit`.
- Setup [Git Pre Commit Hook](#git-pre-commit-hook).
	- This will automatically check for coding standards in changed files when developer does `git commit`.
	- If there are any errors/warnings then `git commit` will automatically fail.
	- When all the errors are resolved then only it will allow developer to commit.
- When you push new commits to remote repo, [Travis CI](https://travis-ci.org/ctagroup/home-app) will again check for coding standards.
	- It will notify the developer if anything goes wrong.

# Git Pre Commit Hook
- Run this command to add pre commit hook for this git repository. `ln -s .eslint-pre-commit .git/hooks/pre-commit`

# Directory Structure

```
- client - Code that will run on client side i.e., Browser
|
--- events - All JS DOM events and their callback methods
|
--- helpers - All helper methods for Meteor templates
|
--- lib - Any third-party JS library
|
--- stylesheets - All the CSS/SCSS for the project.
|
--- views - All the templates for the project.
|
- config - Any code related to project configuration. E.g., UserAccounts configuration (Stays on client)
|
- deploy - Multiple deploy configurations for this project.
|
--- cta-home-aws - Deploy config for CTA's AWS server.
|
- lib - Common code that's not a part of meteor architecture. Common JS code is to be put in this folder. This will be available on both, server side & client side.
|
- models - Database models for Meteor Collections and their schemas.
|
- packages - Any third-party meteor packages.
|
- public - Public assets such as images, fevicons, css etc.
|
--- imgs - All the publis images for the project. E.g., logo, spinner etc.
|
- router - All the routes for this app.
|
- server - Code that will run on server side.
|
--- config - Server side config code. E.g., UserAccounts services such as Google, Facebook, HMIS etc.
|
--- lib - Server side plain JS code common to the project like HMIS API wrappers.
|
--- methods - Meteor methods to be run on server side.
|
--- publish - Meteor code to publish collection data to client side.
```

# Files Pending for ESLint Errors

- ./client/events
- ./client/helpers
- ./client/lib
- ./client/stylesheets
- ./client/views
- ./client/events/appNav.js
- ./client/events/clientInfo.js
- ./client/events/logSurvey.js
- ./client/events/message.js
- ./client/events/searchClient.js
- ./client/events/surveyStatus.js
- ./client/helpers/appNav.js
- ./client/helpers/clientInfo.js
- ./client/helpers/footer.js
- ./client/helpers/logSurveyHelpers.js
- ./client/helpers/login.js
- ./client/helpers/message_list.js
- ./client/helpers/searchClient.js
- ./client/helpers/surveyStatus.js
- ./client/lib/logger.js
- ~~./client/stylesheets/_avatar.scss~~
- ~~./client/stylesheets/_chat.css~~
- ~~./client/stylesheets/_footer.scss~~
- ~~./client/stylesheets/_layout.scss~~
- ~~./client/stylesheets/_misc.scss~~
- ~~./client/stylesheets/_nav.scss~~
- ~~./client/stylesheets/_typehead.scss~~
- ~~./client/stylesheets/style.scss~~
- ~~./client/views/appDashboard.html~~
- ~~./client/views/appNav.html~~
- ~~./client/views/chat.html~~
- ~~./client/views/client~~
- ~~./client/views/footer.html~~
- ~~./client/views/home.html~~
- ~~./client/views/login.html~~
- ~~./client/views/notEnoughPermission.html~~
- ~~./client/views/privacy.html~~
- ~~./client/views/survey~~
- ~~./client/views/termsOfUse.html~~
- ~~./client/views/client/clientForm.html~~
- ~~./client/views/client/clientNotFound.html~~
- ~~./client/views/client/createClient.html~~
- ~~./client/views/client/editClient.html~~
- ~~./client/views/client/searchClient.html~~
- ~~./client/views/client/viewClient.html~~
- ~~./client/views/survey/logSurvey.html~~
- ~~./client/views/survey/surveyStatus.html~~
- ~~./config/accounts.js~~
- ~~./config/adminConfig.js~~
- ~~./deploy/cta-home-aws~~
- ~~./deploy/cta-home-aws/mup.json~~
- ~~./deploy/cta-home-aws/settings.json~~
- ~~./lib/generalHelpers.js~~
- ~~./meteor-mongodb backup/meteor~~
- ~~./meteor-mongodb backup/mongodump-readme.txt~~
- ~~./meteor-mongodb backup/meteor/client.bson~~
- ~~./meteor-mongodb backup/meteor/client.metadata.json~~
- ~~./meteor-mongodb backup/meteor/enrollment.bson~~
- ~~./meteor-mongodb backup/meteor/enrollment.metadata.json~~
- ~~./meteor-mongodb backup/meteor/exit.bson~~
- ~~./meteor-mongodb backup/meteor/exit.metadata.json~~
- ~~./meteor-mongodb backup/meteor/hmis_type.bson~~
- ~~./meteor-mongodb backup/meteor/hmis_type.metadata.json~~
- ~~./meteor-mongodb backup/meteor/homeRoles.bson~~
- ~~./meteor-mongodb backup/meteor/homeRoles.metadata.json~~
- ~~./meteor-mongodb backup/meteor/meteor_accounts_loginServiceConfiguration.bson~~
- ~~./meteor-mongodb backup/meteor/meteor_accounts_loginServiceConfiguration.metadata.json~~
- ~~./meteor-mongodb backup/meteor/meteor_oauth_pendingCredentials.bson~~
- ~~./meteor-mongodb backup/meteor/meteor_oauth_pendingCredentials.metadata.json~~
- ~~./meteor-mongodb backup/meteor/questions.bson~~
- ~~./meteor-mongodb backup/meteor/questions.metadata.json~~
- ~~./meteor-mongodb backup/meteor/rolePermissions.bson~~
- ~~./meteor-mongodb backup/meteor/rolePermissions.metadata.json~~
- ~~./meteor-mongodb backup/meteor/roles.bson~~
- ~~./meteor-mongodb backup/meteor/roles.metadata.json~~
- ~~./meteor-mongodb backup/meteor/surveys.bson~~
- ~~./meteor-mongodb backup/meteor/surveys.metadata.json~~
- ~~./meteor-mongodb backup/meteor/system.indexes.bson~~
- ~~./meteor-mongodb backup/meteor/users.bson~~
- ~~./meteor-mongodb backup/meteor/users.metadata.json~~
- ~~./models/_schema.js~~
- ~~./models/adminSettingsSchema.js~~
- ~~./models/clientInfoSchema.js~~
- ~~./models/homeRoles.js~~
- ~~./models/messages.js~~
- ~~./models/optionsSchema.js~~
- ~~./models/questionsSchema.js~~
- ~~./models/responseSchema.js~~
- ~~./models/rolePermissions.js~~
- ~~./models/surveyQuestionsMasterSchema.js~~
- ~~./models/surveysSchema.js~~
- ~~./models/usersSchema.js~~
- ~~./packages/meteor-admin~~
- ~~./packages/meteor-admin/LICENSE~~
- ~~./packages/meteor-admin/README.md~~
- ~~./packages/meteor-admin/lib~~
- ~~./packages/meteor-admin/package.js~~
- ~~./packages/meteor-admin/readme~~
- ~~./packages/meteor-admin/lib/both~~
- ~~./packages/meteor-admin/lib/client~~
- ~~./packages/meteor-admin/lib/server~~
- ~~./packages/meteor-admin/lib/both/AdminDashboard.coffee~~
- ~~./packages/meteor-admin/lib/both/collections.coffee~~
- ~~./packages/meteor-admin/lib/both/homeRouter.js~~
- ~~./packages/meteor-admin/lib/both/homeStartup.js~~
- ~~./packages/meteor-admin/lib/both/router.coffee~~
- ~~./packages/meteor-admin/lib/both/startup.coffee~~
- ~~./packages/meteor-admin/lib/both/utils.coffee~~
- ~~./packages/meteor-admin/lib/client/html~~
- ~~./packages/meteor-admin/lib/client/js~~
- ~~./packages/meteor-admin/lib/client/stylesheets~~
- ~~./packages/meteor-admin/lib/client/html/admin_header.html~~
- ~~./packages/meteor-admin/lib/client/html/admin_layouts.html~~
- ~~./packages/meteor-admin/lib/client/html/admin_sidebar.html~~
- ~~./packages/meteor-admin/lib/client/html/admin_templates.html~~
- ~~./packages/meteor-admin/lib/client/html/admin_widgets.html~~
- ~~./packages/meteor-admin/lib/client/html/question_templates.html~~
- ~~./packages/meteor-admin/lib/client/html/survey_templates.html~~
- ~~./packages/meteor-admin/lib/client/js/adminLayout.js~~
- ~~./packages/meteor-admin/lib/client/js/autoForm.coffee~~
- ~~./packages/meteor-admin/lib/client/js/events.coffee~~
- ~~./packages/meteor-admin/lib/client/js/helpers.coffee~~
- ~~./packages/meteor-admin/lib/client/js/homeAutoForm.js~~
- ~~./packages/meteor-admin/lib/client/js/homeEvents.js~~
- ~~./packages/meteor-admin/lib/client/js/homeHelpers.js~~
- ~~./packages/meteor-admin/lib/client/js/slim_scroll.js~~
- ~~./packages/meteor-admin/lib/client/js/templates.coffee~~
- ~~./packages/meteor-admin/lib/client/stylesheets/_admin.scss~~
- ~~./packages/meteor-admin/lib/client/stylesheets/_settings.scss~~
- ~~./packages/meteor-admin/lib/client/stylesheets/_survey.scss~~
- ~~./packages/meteor-admin/lib/client/stylesheets/style.scss~~
- ~~./packages/meteor-admin/lib/server/homeMethods.js~~
- ~~./packages/meteor-admin/lib/server/homePublish.js~~
- ~~./packages/meteor-admin/lib/server/methods.coffee~~
- ~~./packages/meteor-admin/lib/server/publish.coffee~~
- ~~./packages/meteor-admin/readme/screenshot1.png~~
- ~~./packages/meteor-admin/readme/screenshot2.png~~
- ~~./public/imgs~~
- ~~./public/imgs/logo.png~~
- ~~./public/imgs/spinner.gif~~
- ~~./router/app.js~~
- ~~./server/_lib~~
- ~~./server/config~~
- ~~./server/hmis~~
- ~~./server/methods~~
- ~~./server/publish~~
- ~~./server/_lib/logger.js~~
- ~~./server/config/accounts.js~~
- ~~./server/config/environment.js~~
- ~~./server/config/mergeAccountsPatch.js~~
- ~~./server/config/sortableCollections.js~~
- ~~./server/hmis/hmisApi.js~~
- ~~./server/methods/searchClient.js~~
- ~~./server/methods/viewClient.js~~
- ~~./server/publish/fixtures.js~~
