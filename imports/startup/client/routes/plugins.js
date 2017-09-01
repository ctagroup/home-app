import '/imports/ui/content/login';

const publicRoutes = [
  'root',
  'privacy',
  'termsOfUse',
  'notEnoughPermissions',
  'signIn',
];

AccountsTemplates.configureRoute('signIn', {
  name: 'signIn',
  path: '/login',
  template: 'Login',
  redirect: '/dashboard',
  layoutTemplate: 'ContentLayout',
});


Router.plugin('auth', {
  except: publicRoutes,
  authenticate: {
    home: 'root',
    route: 'signIn',
  },
});
