Home Meteor App
===============

[![Build Status](https://travis-ci.org/ctagroup/home-app.svg?branch=master)](https://travis-ci.org/ctagroup/home-app)

## Prerequisites

- Node: https://nodejs.org/en/
	- Preferred way to install: https://github.com/creationix/nvm
- Meteor: https://www.meteor.com/install

## How to Run on local machine

Maker a local copy `settings.local.json` of the file `settings.json`

```
git clone git@github.com:ctagroup/home-app.git
cd home-app
git checkout master
meteor npm install
meteor run --settings settings.local.json
```

## Testing

To run tests:
```
npm run test
```

## Deploy instructions

Meteor Up is used to deploy this app. Ref: https://github.com/kadirahq/meteor-up

#### Deploy configs

- `./deploy/cta-home-aws`
	- This is for AWS server for http://home.ctagroup.org
	- This server is behind http auth. Following are the user credentials.
	- `easyengine / bLGMpn`
	- You need to have CTA AWS server's `home.pem` key.
	- Once you have it, rename it and put the file under `~/.ssh/home.pem` path. Because it is configured this way for deploy config.
	- Change file permissions of `home.pem`. `chmod 400 ~/.ssh/home.pem`

#### First time steps

- Install meteor-up. `npm install -g mup`

#### Deploy steps

- Go to directory `./.deploy/<server-dir>`.
- Run `mup deploy`. This command will initiate the deployment of the current version of project in your filesystem.

## SSL Certificate

Login to Server with SSH using `home.pem` key to perform following actions.

### Enable

```
sudo ee site update home.ctagroup.org --letsencrypt
```

### Disable

```
sudo ee site update home.ctagroup.org --letsencrypt=off
```

### Renew

```
sudo ee site update home.ctagroup.org --letsencrypt=renew
```

## Mongo DB Backup & Restore from Docker Server

### Dump

```
docker run \
 --rm \
 --link mongodb:mongo \
 -v /home/ubuntu/backup-dir:/backup \
 mongo \
 bash -c 'mongodump --out /backup --host $MONGO_PORT_27017_TCP_ADDR'
```

### Restore

```
docker run \
 --rm \
 --link mongodb:mongo \
 -v /home/ubuntu/home-app/meteor-mongodb\ backup/dump-2016-08-15:/backup \
 mongo \
 bash -c 'mongorestore --drop -d home-monterey /backup/home-cta --host $MONGO_PORT_27017_TCP_ADDR'
```

Ref: https://gist.github.com/desaiuditd/53fbfa61d564e2a9d84376e1237fdd36

## Access MongoDB on the Server

- Login to the server with SSH.
- `docker exec -it mongodb mongo home-cta`

Ref: https://github.com/kadirahq/meteor-up/#accessing-the-database


## Coding guidelines

Each publication and method should log its details:

```
logger.info(`PUB[${this.userId}]: name`, params);
logger.info(`METHOD[${Meteor.userId()}]: name`, params);
```

Each method call should use Bert to report succes/error as below. `err` can be a string or an exception.

```
import Alert from '/imports/ui/alert';

Alert.error(err);
Alert.success('Question updated');
```


If you make a call to edit/remove HMIS item you need to update local (client side) collection to reflect the
changes. Ie.

```
Clients._collection.update(client._id, { $set: result }); // eslint-disable-line
```

Use `authorize` key in a router to check user permissions:

```
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), ResponsesAccessRoles);
    },
  },
```

## Survey definition


### Survey logic

Form `values` are current question responses. If there is question with id = `question1` and a change occurs for this question
(i.e. text is entered), `values.question1` will hold a response given to this question.

Form `variables` are recalculated on each value change. When a change occurs (i.e. user types a response), variables
are first initialized with initial values provided in `form.variables`, then rules are fired which may change the variables.
Rules are fired from top to bottom.

Form `props` are similar to values because the are persistent - when a change occurs, props are not reset to default values like variables do. In contrast to values, props are not submitted when the form is submitted. So far `props` are used to implement skipping sections.

### Special variables

Some variables have special meaning. Set `variables.ID.hidden` equal to `1` to hide element with a given ID.

### Conditions

Checking for a question response value

```
[OPERATOR, values.ID|variables.ID|props.ID|CONST, values.ID|variables.ID|props.ID|CONST]
['==', 'values.pregnantMember', 'Yes']
['>=', 'variables.numChildren', 3],
['==', 'props.parent2.skip', 1],
```

### Actions

Setting a variable:
```
['set', 'score2', 1]
```
Now there will be a variable `variables.score2` with value of `1`.

Setting element property:
```
['pset', 'question1.skip', 1]
```
This sets question1 as skipped (value is erased, question cannot be edited)

### Operand reducers

`[variable.ID|client.ID|value.ID]:REDUCER1:REDUCER2`

Reduces will apply transformations to the value of an operand. Reducers can be chained using `:` notation.

As an example `client.dob:age` will return age based on the date of birth of a client
```

Reducers can be applied to arrays (set of values for a certain column in a grid):
```
['set', 'youngestChildAge', 'values.children.age:min'],
```
will set a `variables.youngestChildAge` equal to smallest value in `age` column of a `children` grid

Avaliable reducers:

- `date`: transforms timestamp (number) to a date,
- `age`: calculates age given the value (date) and the current date
- `min/max`: returns min/max from an array


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
- useraccounts:iron-routing : https://atmospherejs.com/useraccounts/iron-routing
	- Provides custom routes for User login related templates
- email : https://atmospherejs.com/meteor/email
	- Email utility for meteor
- service-configuration : https://atmospherejs.com/meteor/service-configuration
	- OAuth Utility for service configurations
	- Manage the configuration for third-party services like Google, Facebook Oauth login
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
- session
	- Session variable
- standard-minifiers
	- Standard minifiers used with Meteor apps by default.
- tracker
	- Dependency tracker to allow reactive callbacks
- oauth2
	- oauth 2.0 library for HMIS API
