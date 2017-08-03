import { AppController } from './controllers';

Router.route(
  'openingScript', {
    path: '/openingScript',
    template: 'openingScript',
    controller: AppController,
    action() {
      this.render();
    },
    onBeforeAction() {
      if (!Roles.userIsInRole(Meteor.user(), ['Developers', 'System Admin'])) {
        Router.go('notEnoughPermission');
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', 'Opening Script');
      Session.set('admin_collection_name', 'openingScript');
      Session.set('admin_collection_page', '');
    },
  }
);
