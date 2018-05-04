import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';
import { AppController } from './controllers';
import '/imports/ui/openingScript/openingScript';

import FeatureDecisions from '/imports/both/featureDecisions';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
let checkPermissions;
if (featureDecisions.roleManagerEnabled()) {
  checkPermissions = (userId) => ableToAccess(userId, 'accessOpeningScript');
} else {
  checkPermissions = (userId) => Roles.userIsInRole(userId, DefaultAdminAccessRoles);
}

Router.route(
  'openingScript', {
    path: '/openingScript',
    template: Template.openingScript,
    controller: AppController,
    authorize: {
      allow() {
        return checkPermissions(Meteor.userId());
      },
    },
    data() {
      return {
        title: 'Opening script',
      };
    },
  }
);
