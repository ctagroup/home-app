import { logger } from '/imports/utils/logger';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import EventLog from '../eventLog';

Meteor.publish('events.all', function publishAllEvents() {
  logger.info(`PUB[${this.userId}]: events.all`);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }

  return EventLog.queryRecentEvents();
});
