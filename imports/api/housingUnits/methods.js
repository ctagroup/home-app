import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import { HousingUnitsAccessRoles } from '/imports/config/permissions';
import eventPublisher, { UserEvent } from '/imports/api/eventLog/events';

Meteor.methods({
  'housingUnits.create'(housingObject) {
    logger.info(`METHOD[${this.userId}]: housingUnits.create`, housingObject);
    if (!Roles.userIsInRole(this.userId, HousingUnitsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const result = hc.api('housing').createHousingUnit(_.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.accountId,
    }));

    eventPublisher.publish(new UserEvent(
      'housingUnits.create',
      '',
      { userId: this.userId, result }
    ));

    return result;
  },

  'housingUnits.update'(id, housingObject) {
    logger.info(`METHOD[${this.userId}]: housingUnits.update`, id, housingObject);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, HousingUnitsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const result = hc.api('housing').updateHousingUnit(id, _.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.accountId,
    }));

    eventPublisher.publish(new UserEvent(
      'housingUnits.update',
      `${id}`,
      { userId: this.userId, housingObject }
    ));

    return result;
  },

  'housingUnits.delete'(id) {
    logger.info(`METHOD[${this.userId}]: housingUnits.delete`, id);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, HousingUnitsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    const result = hc.api('housing').deleteHousingUnit(id);

    eventPublisher.publish(new UserEvent(
      'housingUnits.delete',
      `${id}`,
      { userId: this.userId }
    ));

    return result;
  },
});
