import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import Projects from '/imports/api/projects/projects';
import { AppController } from './controllers';
import '/imports/ui/projects/projectsListView';
import '/imports/ui/projects/projectsNew';
import '/imports/ui/projects/projectsEdit';

import FeatureDecisions from '/imports/both/featureDecisions';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
let checkPermissions;
if (featureDecisions.roleManagerEnabled()) {
  checkPermissions = (userId) => ableToAccess(userId, 'accessProjects');
} else {
  checkPermissions = (userId) => Roles.userIsInRole(userId, DefaultAdminAccessRoles);
}


Router.route(
  'projectsList', {
    path: '/projects',
    template: Template.projectsListView,
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
      return {
        title: 'Projects',
        subtitle: 'List',
      };
    },
  }
);

Router.route(
  'projectsNew', {
    path: '/projects/new',
    template: Template.projectsNew,
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
      return {
        title: 'Projects',
        subtitle: 'New',
        doc: {},
      };
    },
  }
);

Router.route(
  'projectsEdit', {
    path: '/projects/:schema/:_id/edit',
    template: Template.projectsEdit,
    controller: AppController,
    authorize: {
      allow() {
        return checkPermissions(Meteor.userId());
      },
    },
    waitOn() {
      const id = Router.current().params._id;
      const schema = Router.current().params.schema;
      return [
        Meteor.subscribe('projects.one', id, schema),
      ];
    },
    data() {
      const id = Router.current().params._id;
      return {
        title: 'Projects',
        subtitle: 'Edit',
        doc: Projects.findOne(id),
      };
    },
  }
);
