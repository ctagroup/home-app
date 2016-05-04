Home Meteor App
===============

## Prerequisites

- Node: https://nodejs.org/en/
	- Preferred way to install: https://github.com/creationix/nvm
- Meteor: https://www.meteor.com/install

## How to Run on local machine

```
git clone git@github.com:ctagroup/home-app.git
cd home-app
git checkout meteor
meteor run
```

## Deploy instructions

Meteor Up is used to deploy this app. Ref: https://github.com/arunoda/meteor-up

#### Deploy configs

- `./deploy/cta-home-aws`
	- This is for AWS server for http://home.ctagroup.org
	- This server is behind firewall. Following are the user credentials.
	- `easyengine / bLGMpn`
	- You need to have CTA AWS server's `home.pem` key.
	- Once you have it, rename it and put the file under `~/.ssh/home.pem` path. Because it is configured this way for deploy config.
	- Change file permissions of `home.pem`. `chmod 400 ~/.ssh/home.pem`

#### First time steps

- Install meteor-up. `npm install -g mup`

#### Deploy steps

- Go to directory `./deploy/cta-home-aws`.
- Run `mup deploy`. This command will initiate the deployment of the current version of project in your filesystem.

## Meteor Components in use

- Iron Router : https://github.com/iron-meteor/iron-router
	- This helps in defining all the routes
- Twitter Bootstrap : https://atmospherejs.com/twbs/bootstrap
	- This provides basic UI elements and styles
- Meteor SCSS : https://github.com/fourseven/meteor-scss
	- SCSS CSS pre-processor
- Meteor Active Route : https://github.com/zimme/meteor-active-route
	- Utility component to detect active menu item in navigation
- useraccounts:bootstrap : https://atmospherejs.com/useraccounts/bootstrap
	- This provides User login UI for accounts component
- accounts-password : https://atmospherejs.com/meteor/accounts-password
	- Provides password based login
- useraccounts:iron-routing : https://atmospherejs.com/useraccounts/iron-routing
	- Provides custom routes for User login related templates
- email : https://atmospherejs.com/meteor/email
	- Email utility for meteor
- service-configuration : https://atmospherejs.com/meteor/service-configuration
	- OAuth Utility for service configurations
- accounts-google : https://atmospherejs.com/meteor/accounts-google
	- OAuth Login for Google
- accounts-facebook : https://atmospherejs.com/meteor/accounts-facebook
	- OAuth Login for Facebook
- dburles:collection-helpers
	- Collection utility helpers for DB models
- aldeed:collection2
	- Collection buffer for DB Models
- alanning:roles
	- User Role management
- fortawesome:fontawesome
	- Font Icons
- desaiuditd:admin
	- Admin Dashboard UI
	- Clone of https://github.com/desaiuditd/meteor-admin
- blaze-html-templates
	- HTML Template system for Meteor
- Meteor Check
	- Check & Match module for meteor to compare patterns
- rubaxa:sortable
	- Sortable UI for elements
- jparker:gravatar
	- Gravatar support for users
- jquery
	- jQuery library
- meteor-base
	- Base components in meteor
- mobile-experience
	- adds mobile support for meteor app
- mongo
	- database support for meteor
- mrt:moment
	- moment.js library for time format & conversion
- service-configuration
	- Manage the configuration for third-party services like Google, Facebook Oauth login
- session
	- Session variable
- standard-minifiers
	- Standard minifiers used with Meteor apps by default.
- tracker
	- Dependency tracker to allow reactive callbacks
- oauth2
	- oauth 2.0 library for HMIS API
