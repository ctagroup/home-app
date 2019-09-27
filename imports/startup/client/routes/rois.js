import { ClientsAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import '/imports/ui/rois/roisNew';
import '/imports/ui/rois/roisEdit';


Router.route(
  'roisNew', {
    path: '/rois/new',
    template: Template.roisNew,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
      },
    },
    data() {
      return {
        title: 'ROIs',
        subtitle: 'New',
        doc: {},
      };
    },
  }
);

Router.route(
  'roisEdit', {
    path: '/rois/:id/edit',
    template: Template.roisEdit,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), ClientsAccessRoles);
      },
    },
    data() {
      const id = Router.current().params.id;
      const dedupClientId = (Router.current().query || {}).dedupClientId;
      return {
        title: 'ROIs',
        subtitle: 'Edit',
        id,
        dedupClientId,
      };
    },
  }
);
