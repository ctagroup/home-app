import { AppController } from './controllers';
import Projects from '/imports/api/projects/projects';
import '/imports/ui/projectSetup/projectSetup';

Router.route(
  'projectSetup', {
    path: '/projectSetup',
    template: Template.projectSetup,
    controller: AppController,
    waitOn() {
      return Meteor.subscribe('projects.list');
    },
    data() {
      const project = Projects.findOne({ isAppProject: true });
      console.log(Projects.find().fetch());
      return {
        title: 'Project Setup',
        project,
      };
    },
  }
);
