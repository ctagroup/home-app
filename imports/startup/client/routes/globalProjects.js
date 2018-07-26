import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import { AppController } from './controllers';
import '/imports/ui/globalProjects/globalProjectsListView';
import '/imports/ui/globalProjects/globalProjectsNew';
import '/imports/ui/globalProjects/globalProjectsEdit';


Router.route(
  'globalProjectsList', {
    path: '/globalProjects',
    template: Template.globalProjectsListView,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('globalProjects.all'),
      ];
    },
    data() {
      return {
        title: 'Global Projects',
        subtitle: 'List',
      };
    },
  }
);

Router.route(
  'globalProjectsNew', {
    path: '/globalProjects/new',
    template: Template.globalProjectsNew,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('globalProjects.all'),
        Meteor.subscribe('projects.all'),
      ];
    },
    data() {
      return {
        title: 'Global Projects',
        subtitle: 'New',
        doc: {},
      };
    },
  }
);

Router.route(
  'globalProjectsEdit', {
    path: '/globalProjects/:_id/edit',
    template: Template.projectsEdit,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      // const id = Router.current().params._id;
      return [
        Meteor.subscribe('globalProjects.all'),
        Meteor.subscribe('projects.all'),
      ];
    },
    data() {
      const id = Router.current().params._id;
      return {
        title: 'Global Projects',
        subtitle: 'Edit',
        doc: GlobalProjects.findOne(id) || {},
      };
    },
  }
);
