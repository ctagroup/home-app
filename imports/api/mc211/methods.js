import { logger } from '/imports/utils/logger';

Meteor.methods({
  'mc211.approveClientFiles'(client) {
    logger.info(`METHOD[${Meteor.userId()}]: mc211.approveClientFiles`, client);
    throw new Meteor.Error('Not implemented');
  },
  'mc211.rejectClientFiles'(client) {
    logger.info(`METHOD[${Meteor.userId()}]: mc211.rejectClientFiles`, client);
    throw new Meteor.Error('Not implemented');
  },
});
