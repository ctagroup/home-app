import Projects from '/imports/api/projects/projects';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import '/imports/ui/projectSetup/projectSetup';

Router.route(
  'projectSetup', {
    path: '/projectSetup',
    template: Template.projectSetup,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return Meteor.subscribe('projects.list');
    },
    data() {
      const project = Projects.findOne({ isAppProject: true });
      return {
        title: 'Project Setup',
        project,
      };
    },
  }
);
