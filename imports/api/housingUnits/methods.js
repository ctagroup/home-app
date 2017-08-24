import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';

Meteor.methods({
  'housingUnits.create'(housingObject) {
    logger.info('creating housing unit', housingObject);
    // TODO: permissions
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('housing').createHousingUnit(_.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.id,
    }));
  },

  'housingUnits.update'(id, housingObject) {
    logger.info('updating housing unit', id, housingObject);
    // TODO: permissions
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('housing').updateHousingUnit(id, _.extend(housingObject, {
      userId: Meteor.users.findOne(this.userId).services.HMIS.id,
    }));
  },

  'housingUnits.delete'(id) {
    logger.info('deleting housing unit', id);
    // TODO: permissions
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('housing').deleteHousingUnit(id);
  },
});
