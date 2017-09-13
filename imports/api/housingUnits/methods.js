import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';

Meteor.methods({
  'housingUnits.create'(housingObject) {
    logger.info(`METHOD[${Meteor.userId()}]: housingUnits.create`, housingObject);
    // TODO: permissions
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('housing').createHousingUnit(_.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.id,
    }));
  },

  'housingUnits.update'(id, housingObject) {
    logger.info(`METHOD[${Meteor.userId()}]: housingUnits.update`, id, housingObject);
    // TODO: permissions
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('housing').updateHousingUnit(id, _.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.id,
    }));
  },

  'housingUnits.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: housingUnits.delete`, id);
    // TODO: permissions
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('housing').deleteHousingUnit(id);
  },
});
