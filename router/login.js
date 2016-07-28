/**
 * Created by udit on 28/07/16.
 */

/**
 * Public Routes without login
 */
const publicRoutes = [
  'root',
  'home',
  'changePwd',
  'enrollAccount',
  'forgotPwd',
  'resetPwd',
  'signIn',
  'signUp',
  'verifyEmail',
  'resendVerificationEmail',
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
    controller: 'HomeAppController',
  }
);
AccountsTemplates.configureRoute(
  'signUp', {
    name: 'signUp',
    path: '/register',
    template: 'login',
    controller: 'HomeAppController',
  }
);

/**
 * Ensure User Login for templates
 */
Router.plugin(
  'ensureSignedIn', {
    except: publicRoutes,
  }
);

