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
- Run following commands to add pre commit hook for this git repository.
    - `cd .git/hooks`
    - `ln -s ../../.eslint-pre-commit pre-commit`
    - `cd ../../`

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

# Console Logs

ESLint doesn't allow (only warning) `console.*` methods such as `console.log`, `console.debug` etc.

So we have added another logging utility called [Winston](https://github.com/winstonjs/winston).

Ideally, you should not be putting console logs in your production code but just in case you need to put it, use Winston methods for that.

We've created a wrapper object called `logger` to use Winston. And this object is availbel globally on client & server, both the environments.

```
logger.log('info', "YOYO - This is Log");
logger.info("YOYO - This is Info");
logger.debug("YOYO - This is Debug");
logger.warn("YOYO - This is Warning");
logger.error("YOYO - This is Error");
```
