import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import { AppController } from './controllers';
import '/imports/ui/consentGroups/consentGroupsListView';
import '/imports/ui/consentGroups/consentGroupsNew';
import '/imports/ui/consentGroups/consentGroupsEdit';


Router.route(
  'consentGroupsList', {
    path: '/consentGroups',
    template: Template.consentGroupsListView,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      return [
        Meteor.subscribe('agencies.all'),
        Meteor.subscribe('consentGroups.all'),
      ];
    },
    data() {
      return {
        title: 'Consent Groups',
        subtitle: 'List',
      };
    },
  }
);

Router.route(
  'consentGroupsNew', {
    path: '/consentGroups/new',
    template: Template.consentGroupsNew,
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
        title: 'Consent Groups',
        subtitle: 'New',
        doc: {},
      };
    },
  }
);

Router.route(
  'consentGroupsEdit', {
    path: '/consentGroups/:_id/edit',
    template: Template.consentGroupsEdit,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
      },
    },
    waitOn() {
      const id = Router.current().params._id;
      return [
        Meteor.subscribe('agencies.all'),
        Meteor.subscribe('consentGroups.one', id),
      ];
    },
    data() {
      const id = Router.current().params._id;

      return {
        title: 'Consent Groups',
        subtitle: 'Edit',
        doc: ConsentGroups.findOne(id),
      };
    },
  }
);
