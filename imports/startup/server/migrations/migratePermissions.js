import RolePermissions from '/imports/api/rolePermissions/rolePermissions';
import {
  ClientsAccessRoles,
  FilesAccessRoles,
  GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions.js';

export const migratePermissions = () => {
  ClientsAccessRoles.map((roleName) => {
    const permissionName = 'accessClients';
    return RolePermissions.insert({ roleName, permissionName });
  });
  FilesAccessRoles.map((roleName) => {
    const permissionName = 'accessFiles';
    return RolePermissions.insert({ roleName, permissionName });
  });
  GlobalHouseholdsAccessRoles.map((roleName) => {
    const permissionName = 'accessHouseholds';
    return RolePermissions.insert({ roleName, permissionName });
  });
  HousingUnitsAccessRoles.map((roleName) => {
    const permissionName = 'accessHousingUnits';
    return RolePermissions.insert({ roleName, permissionName });
  });
  PendingClientsAccessRoles.map((roleName) => {
    const permissionName = 'accessPendingClients';
    return RolePermissions.insert({ roleName, permissionName });
  });
  ResponsesAccessRoles.map((roleName) => {
    const permissionName = 'accessResponses';
    return RolePermissions.insert({ roleName, permissionName });
  });
};
