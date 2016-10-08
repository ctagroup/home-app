/**
 * Created by udit on 28/07/16.
 */

/**
 * Public Routes without login
 */
const publicRoutes = [
  'root',
  'home',
  'signIn',
  'privacy',
  'termsOfUse',
  'notEnoughPermission',
];

/**
 * Accounts Routes
 */
AccountsTemplates.configureRoute(
  'signIn', {
    name: 'signIn',
    path: '/login',
    template: 'login',
    redirect: '/dashboard',
    layoutTemplate: 'ContentLayout',
  }
);

AccountsTemplates.configureRoute('ensureSignedIn', {
  template: 'login',
  layoutTemplate: 'ContentLayout',
});

/**
 * Ensure User Login for templates
 */
Router.plugin(
  'ensureSignedIn', {
    except: publicRoutes,
  }
);

Router.route(
  '/logout', {
    name: 'logout',
    template: 'logout',
    onBeforeAction() {
      AccountsTemplates.logout();
      this.next();
    },
  }
);
