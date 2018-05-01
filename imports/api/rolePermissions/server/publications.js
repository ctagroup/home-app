import { logger } from '/imports/utils/logger';
import RolePermissions from '/imports/api/rolePermissions/rolePermissions';

Meteor.publish('rolePermissions.all', function publishAllRolePermissions() {
  logger.debug(`Publishing 'rolePermissions.all' to ${this.userId}`);

  const options = {}; // { fields };
  const cursor = RolePermissions.find({}, options);

  return cursor;
});
