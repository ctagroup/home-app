import {
  ClientsAccessRoles,
  FilesAccessRoles,
  GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions.js';
// TODO [VK]: wrap into migration, set proper role-permission assignment
ClientsAccessRoles.map((role) => {
  // Add permission to role;
  console.log('role', role);
  return 'accessClients';
});
FilesAccessRoles.map((role) => {
  // Add permission to role;
  console.log('role', role);
  return 'accessFiles';
});
GlobalHouseholdsAccessRoles.map((role) => {
  // Add permission to role;
  console.log('role', role);
  return 'accessHouseholds';
});
HousingUnitsAccessRoles.map((role) => {
  // Add permission to role;
  console.log('role', role);
  return 'accessHousingUnits';
});
PendingClientsAccessRoles.map((role) => {
  // Add permission to role;
  console.log('role', role);
  return 'accessPendingClients';
});
ResponsesAccessRoles.map((role) => {
  // Add permission to role;
  console.log('role', role);
  return 'accessResponses';
});
