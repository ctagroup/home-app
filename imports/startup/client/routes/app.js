import { AppController } from './controllers';


Router.route('dashboard', {
  path: '/dashboard',
  template: 'dashboard',
  controller: AppController,
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
  '/not-enough-permission', {
    name: 'notEnoughPermission',
    template: 'notEnoughPermission',
    controller: AppController,
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

/*
Router.route(
  '/chat/', {
    name: 'chat',
    template: 'chat',
    controller: 'AppController',
  }
);
*/
