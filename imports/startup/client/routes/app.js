import FeatureDecisions from '/imports/both/featureDecisions';
import { AppController } from './controllers';
import '/imports/ui/content/logout';
import '/imports/ui/app/notEnoughPermissions';
import '/imports/ui/dashboard/dashboard';
import '/imports/ui/dashboard/dashboardMc211';


Router.route('dashboard', {
  path: '/dashboard',
  template: 'dashboard',
  controller: AppController,
  onBeforeAction: ['authenticate'],
  waitOn() {
    return Meteor.subscribe('collectionsCount');
  },
  data() {
    return {
      title: 'Dashboard',
    };
  },
});

Router.route(
  '/not-enough-permissions', {
    name: Template.NotEnoughPermissions,
    template: Template.NotEnoughPermission,
    controller: AppController,
  }
);

Router.route(
  '/logout', {
    name: 'logout',
    template: Template.Logout,
    onBeforeAction() {
      AccountsTemplates.logout();
      this.next();
    },
  }
);

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
if (featureDecisions.isMc211App()) {
  Router.route(
    '/reporting', {
      name: 'reporting',
      template: Template.Reporting,
      controller: AppController,
      data() {
        return {
          title: 'Reporting',
        };
      },
    }
  );
}


/*
Router.route(
  '/chat/', {
    name: 'chat',
    template: 'chat',
    controller: 'AppController',
  }
);
*/
