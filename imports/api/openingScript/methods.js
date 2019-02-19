import { logger } from '/imports/utils/logger';
import OpeningScript from '/imports/api/openingScript/openingScript';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Meteor.methods({
  'openingScript.save'(doc) {
    logger.info(`METHOD[${this.userId}]: openingScript.save`, doc);
    check(doc, OpeningScript.schema);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    OpeningScript.save(doc);
  },
});
