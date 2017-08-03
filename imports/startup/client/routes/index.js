import './app';
import './content';
import './clients';
import './eligibleClients';
import './housingMatch';
import './questions';
import './surveys';
import './responses';
import './housingUnits';
import './globalHouseholds';
import './users';
import './roleManager';
import './openingScript';
import './projectSetup';

AccountsTemplates.configureRoute('signIn', {
  name: 'signIn',
  path: '/login',
  template: 'login',
  redirect: '/dashboard',
  layoutTemplate: 'ContentLayout',
});

/*
AccountsTemplates.configureRoute('ensureSignedIn', {
  template: 'login',
  layoutTemplate: 'ContentLayout',
});
*/

// Prompt for sign in form in case of all routes except the following
Router.plugin(
  'ensureSignedIn', {
    except: _.pluck(AccountsTemplates.routes, 'name').concat([
      'root',
      'privacy',
      'termsOfUse',
      'notEnoughPermission',
    ]),
  }
);
