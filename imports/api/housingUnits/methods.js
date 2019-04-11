import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import { HousingUnitsAccessRoles } from '/imports/config/permissions';

Meteor.methods({
  'housingUnits.create'(housingObject) {
    logger.info(`METHOD[${this.userId}]: housingUnits.create`, housingObject);
    if (!Roles.userIsInRole(this.userId, HousingUnitsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('housing').createHousingUnit(_.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.accountId,
    }));
  },

  'housingUnits.update'(id, housingObject) {
    logger.info(`METHOD[${this.userId}]: housingUnits.update`, id, housingObject);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, HousingUnitsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('housing').updateHousingUnit(id, _.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.accountId,
    }));
  },

  'housingUnits.delete'(id) {
    logger.info(`METHOD[${this.userId}]: housingUnits.delete`, id);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, HousingUnitsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('housing').deleteHousingUnit(id);
  },
});
