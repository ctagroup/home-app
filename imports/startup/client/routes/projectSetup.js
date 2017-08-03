import { AppController } from './controllers';

Router.route(
  'projectSetup', {
    path: '/projectSetup',
    template: 'projectSetup',
    controller: AppController,
    waitOn() {
      return Meteor.subscribe('projects');
    },
    action() {
      this.render();
    },
    data() {
      const project = projects.findOne({ isAppProject: true });
      return { project };
    },
    onBeforeAction() {
      if (!Roles.userIsInRole(Meteor.user(), ['Developers', 'System Admin'])) {
        Router.go('notEnoughPermission');
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', 'Project Setup');
      // Session.set('admin_collection_name', 'roles');
      // Session.set('admin_collection_page', '');
    },
  }
);
