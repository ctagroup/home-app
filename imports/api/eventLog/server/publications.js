import { logger } from '/imports/utils/logger';
import EventLog from '../eventLog';

Meteor.publish('events.all', function publishAllEvents() {
  logger.info(`PUB[${this.userId}]: events.all`);
  return EventLog.queryRecentEvents();
});
