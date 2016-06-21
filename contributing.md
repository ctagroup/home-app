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
