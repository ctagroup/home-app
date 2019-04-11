import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';

Meteor.methods({
  postHousingMatches() {
    logger.info(`METHOD[${this.userId}]: postHousingMatches`);

    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching').postHousingMatch();
  },
});
