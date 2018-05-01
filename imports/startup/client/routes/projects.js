import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Projects from '/imports/api/projects/projects';
import { AppController } from './controllers';
import '/imports/ui/projects/projectsListView';
import '/imports/ui/projects/projectsNew';
import '/imports/ui/projects/projectsEdit';


Router.route(
  'projectsList', {
    path: '/projects',
    template: Template.projectsListView,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
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
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
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
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
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
