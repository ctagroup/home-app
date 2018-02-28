import { logger } from '/imports/utils/logger';
import RolePermissions from '/imports/api/rolePermissions/rolePermissions';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';

Meteor.methods({
  'roles.addPermission'(roleName, permissionName) {
    logger.info(`METHOD[${Meteor.userId()}]: rolePermissions.addPermission`,
      roleName, permissionName);
    check(roleName, String);
    check(permissionName, String);
    if (Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      return RolePermissions.insert({ roleName, permissionName });
    }
    return null;
  },
  'roles.removePermission'(roleName, permissionName) {
    logger.info(`METHOD[${Meteor.userId()}]: rolePermissions.removePermission`,
      roleName, permissionName);
    check(roleName, String);
    check(permissionName, String);
    if (Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      const rolePermission = RolePermissions.findOne({ roleName, permissionName });
      return RolePermissions.remove(rolePermission._id);
    }
    return null;
  },
});
