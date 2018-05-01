import { PermissionsList, DefaultAdminAccessRoles } from '/imports/config/permissions.js';
import RolePermissions from '/imports/api/rolePermissions/rolePermissions.js';

export const getRolesWithPermission = (permissionName) => {
  console.log('getRolesWithPermission', permissionName);
  if (PermissionsList.indexOf(permissionName) === -1) return [];
  const rolePermissions = RolePermissions.find({ permissionName }).fetch();
  console.log('getRolesWithPermission rolePermissions', rolePermissions);
  return rolePermissions.map(({ roleName }) => roleName);
};

export const getRolePermissions = (role) => {
  const rolePermissions = RolePermissions.find({ roleName: role }).fetch();
  return rolePermissions
    .map(({ roleName }) => roleName)
    .filter(permissionName => PermissionsList.indexOf(permissionName) > -1);
};

export const ableToAccess = (userId, permissionName) => {
  // admin can access everything
  const roles = DefaultAdminAccessRoles.concat(getRolesWithPermission(permissionName));
  console.log('ableToAccess', permissionName, roles, Roles.userIsInRole(userId, roles));
  return Roles.userIsInRole(userId, roles);
};
