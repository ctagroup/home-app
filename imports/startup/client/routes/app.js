import { AppController } from './controllers';


Router.route('dashboard', {
  path: '/dashboard',
  template: 'Dashboard',
  controller: AppController,
  action() {
    this.render();
  },
  onAfterAction() {
    Session.set('admin_title', 'Dashboard');
    Session.set('admin_collection_name', '');
    Session.set('admin_collection_page', '');
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
