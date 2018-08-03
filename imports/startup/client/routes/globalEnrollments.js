import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import GlobalEnrollments from '/imports/api/globalEnrollments/globalEnrollments';
import { AppController } from './controllers';
import '/imports/ui/globalEnrollments/globalEnrollmentsListView';
import '/imports/ui/globalEnrollments/globalEnrollmentsNew';
import '/imports/ui/globalEnrollments/globalEnrollmentsEdit';


Router.route(
  'globalEnrollmentsList', {
    path: '/globalEnrollments',
    template: Template.globalEnrollmentsListView,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      const { clientId, schema } = this.params.query;
      return [
        Meteor.subscribe('globalEnrollments.all', clientId, ),
        Meteor.subscribe('globalEnrollments.all', globalClientId),
      ];
    },
    data() {
      return {
        title: 'Global Enrollments',
        subtitle: 'List',
      };
    },
  }
);

Router.route(
  'globalEnrollmentsNew', {
    path: '/globalEnrollments/new',
    template: Template.globalEnrollmentsNew,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('globalEnrollments.all'),
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
