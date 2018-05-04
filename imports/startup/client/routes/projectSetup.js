import Projects from '/imports/api/projects/projects';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import { AppController } from './controllers';
import '/imports/ui/projectSetup/projectSetup';

import FeatureDecisions from '/imports/both/featureDecisions';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
let checkPermissions;
if (featureDecisions.roleManagerEnabled()) {
  checkPermissions = (userId) => ableToAccess(userId, 'accessProjectSetup');
} else {
  checkPermissions = (userId) => Roles.userIsInRole(userId, DefaultAdminAccessRoles);
}


Router.route(
  'projectSetup', {
    path: '/projectSetup',
    template: Template.projectSetup,
    controller: AppController,
    authorize: {
      allow() {
        return checkPermissions(Meteor.userId());
      },
    },
    waitOn() {
      return [
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
