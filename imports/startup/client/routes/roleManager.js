import { AppController } from './controllers';
import Projects from '/imports/api/projects/projects';


Router.route('roleManager', {
  path: '/roles',
  template: 'roleManager',
  controller: AppController,
  waitOn() {
    return Meteor.subscribe('projects.list');
  },
  data() {
    const project = Projects.findOne({ isAppProject: true });
    return {
      title: 'Role Manager',
      project,
    };
  },
});

