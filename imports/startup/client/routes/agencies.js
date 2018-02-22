import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Agencies from '/imports/api/agencies/agencies';
import Users from '/imports/api/users/users';
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
        Meteor.subscribe('agencies.all'),
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
        collection: Agencies,
        doc: {
          agencyName: undefined,
        },
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
        Meteor.subscribe('agencies.one', id),
        Meteor.subscribe('projects.all'),
        Meteor.subscribe('users.all'),
      ];
    },
    data() {
      const id = Router.current().params._id;

      return {
        title: 'Agencies',
        subtitle: 'Edit',
        collection: Agencies,
        doc: Agencies.findOne(id),
      };
    },
  }
);
