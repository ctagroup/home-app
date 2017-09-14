import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';

Meteor.methods({
  postHousingMatches() {
    logger.info(`METHOD[${Meteor.userId()}]: postHousingMatches`);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('house-matching').postHousingMatch();
  },
});
