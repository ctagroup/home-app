import { AppController } from './controllers';
import '/imports/ui/content/logout';
import '/imports/ui/app/notEnoughPermissions';


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

/*
Router.route(
  '/chat/', {
    name: 'chat',
    template: 'chat',
    controller: 'AppController',
  }
);
*/
