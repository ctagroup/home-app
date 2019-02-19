import '/imports/ui/content/login';
AccountsTemplates.configure({
  privacyUrl: 'privacy',
  termsUrl: 'terms-of-use',
  hideSignUpLink: true,
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signIn',
  path: '/login',
  template: 'Login',
  redirect: '/dashboard',
  layoutTemplate: 'ContentLayout',
});

const publicRoutes = [
  'root',
  'privacy',
  'termsOfUse',
  'notEnoughPermissions',
  'signIn',
];

Router.plugin('auth', {
  except: publicRoutes,
  authenticate: {
    home: 'root',
    route: 'signIn',
  },
});

Router.configure({
  authenticate: 'signIn',
});
