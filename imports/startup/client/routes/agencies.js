import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import { AppController } from './controllers';
import '/imports/ui/agencies/agenciesListView';
import '/imports/ui/agencies/agenciesNew';
import '/imports/ui/agencies/agenciesEdit';

Router.route(
  'agenciesList', {
    path: '/agencies',
    template: Template.agenciesListView,
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
        title: 'Agencies',
        subtitle: 'List',
      };
    },
  }
);

Router.route(
  'agenciesNew', {
    path: '/agencies/new',
    template: Template.agenciesNew,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('projects.all'),
        Meteor.subscribe('users.all'),
      ];
    },
    data() {
      return {
        title: 'Agencies',
        subtitle: 'New',
        doc: {},
      };
    },
  }
);

Router.route(
  'agenciesEdit', {
    path: '/agencies/:_id/edit',
    template: Template.agenciesEdit,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      const id = Router.current().params._id;
      return [
        Meteor.subscribe('globalProjects.one', id),
        Meteor.subscribe('projects.all'),
        Meteor.subscribe('users.all'),
      ];
    },
    data() {
      const id = Router.current().params._id;
      console.log(GlobalProjects.findOne(id));

      return {
        title: 'Agencies',
        subtitle: 'Edit',
        doc: GlobalProjects.findOne(id),
      };
    },
  }
);
