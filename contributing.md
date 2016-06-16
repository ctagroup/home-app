# Coding Standards

We are following [Airbnb JavaScript Style Guide](http://airbnb.io/javascript/).

# How to follow Coding Standards in this project

- First go through the Airbnb Style Guide thoroughly.
- Install [ESLint](http://eslint.org/).
- Run `npm run lint` command to check the coding standards everytime before `git commit`.
- Setup [Git Pre Commit Hook](#git-pre-commit-hook).
	- This will automatically check for coding standards in changed files when developer does `git commit`.
	- If there are any errors/warnings then `git commit` will automatically fail.
	- When all the errors are resolved then only it will allow developer to commit.
- When you push new commits to remote repo, Travis CI will again check for coding standards.
	- It will notify the developer if anything goes wrong.

# Git Pre Commit Hook
- Run this command to add pre commit hook for this git repository. `ln -s .eslint-pre-commit .git/hooks/pre-commit`

# Directory Structure


