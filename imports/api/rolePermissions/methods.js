import { logger } from '/imports/utils/logger';
import RolePermissions from '/imports/api/rolePermissions/rolePermissions';
import { ableToAccess } from '/imports/api/rolePermissions/helpers.js';

Meteor.methods({
  'roles.addPermission'(roleName, permissionName) {
    logger.info(`METHOD[${Meteor.userId()}]: rolePermissions.addPermission`,
      roleName, permissionName);
    check(roleName, String);
    check(permissionName, String);
    if (ableToAccess(this.userId, 'managePermissions')) {
      return RolePermissions.insert({ roleName, permissionName });
    }
    return null;
  },
  'roles.removePermission'(roleName, permissionName) {
    logger.info(`METHOD[${Meteor.userId()}]: rolePermissions.removePermission`,
      roleName, permissionName);
    check(roleName, String);
    check(permissionName, String);
    if (ableToAccess(this.userId, 'managePermissions')) {
      const rolePermission = RolePermissions.findOne({ roleName, permissionName });
      return RolePermissions.remove(rolePermission._id);
    }
    return null;
  },
});
