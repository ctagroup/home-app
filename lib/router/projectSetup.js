/**
 * Created by udit on 22/08/16.
 */

Router.route(
  'projectSetup', {
    path: '/projectSetup',
    template: 'projectSetup',
    controller: 'AppController',
    waitOn() {
      return Meteor.subscribe('projectSetup');
    },
    action() {
      this.render();
    },
    data() {
      let project = projectSetup.find({}).fetch();
      if (project) {
        project = project[0];
      }
      return { project };
    },
    onBeforeAction() {
      if (! Roles.userIsInRole(Meteor.user(), ['Developers', 'System Admin'])) {
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
