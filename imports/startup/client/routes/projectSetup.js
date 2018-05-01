import Projects from '/imports/api/projects/projects';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import { AppController } from './controllers';
import '/imports/ui/projectSetup/projectSetup';

Router.route(
  'projectSetup', {
    path: '/projectSetup',
    template: Template.projectSetup,
    controller: AppController,
    authorize: {
      allow() {
        return ableToAccess(Meteor.userId(), 'accessProjectSetup');
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('rolePermissions.all'),
        Meteor.subscribe('projects.all'),
      ];
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
