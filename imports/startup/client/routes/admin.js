import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { AppController } from './controllers';
import '/imports/ui/admin/hmisClient';


Router.route('/admin/hmisClient', {
  name: 'hmisClient',
  template: 'hmisClient',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles);
    },
  },
  data() {
    return {
      title: 'HMIS Client',
      subtitle: '',
    };
  },
});
