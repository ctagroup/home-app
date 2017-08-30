import '/imports/ui/content/login';

// Prompt for sign in form in case of all routes except the following
Router.plugin(
  'ensureSignedIn', {
    except: _.pluck(AccountsTemplates.routes, 'name').concat([
      'root',
      'privacy',
      'termsOfUse',
      'notEnoughPermissions',
    ]),
  }
);

AccountsTemplates.configureRoute('signIn', {
  name: 'signIn',
  path: '/login',
  template: 'Login',
  redirect: '/dashboard',
  layoutTemplate: 'ContentLayout',
});
