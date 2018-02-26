// import { unique } from '/imports/api/utils';
// import HomeRoles from '/imports/config/roles.js';
// import {
//   ClientsAccessRoles,
//   DefaultAdminAccessRoles,
//   GlobalHouseholdsAccessRoles,
//   HousingUnitsAccessRoles,
//   PendingClientsAccessRoles,
//   ResponsesAccessRoles,
// } from '/imports/config/permissions.js';

// const allRoles = [
//   ClientsAccessRoles,
//   DefaultAdminAccessRoles,
//   GlobalHouseholdsAccessRoles,
//   HousingUnitsAccessRoles,
//   PendingClientsAccessRoles,
//   ResponsesAccessRoles,
// ].reduce((a, b) => a.concat(b));

// console.log('homeroles', HomeRoles, 'allRoles', unique(allRoles));

Meteor.methods({
  // 'rolePermissions.create'(){

  // },
  // 'rolePermissions.delete'(userId, role) {
  //   logger.info(`METHOD[${Meteor.userId()}]: users.delete`, userId);
  //   check(userId, String);
  //   // TODO: permissions
  //   const user = Users.findOne(userId);
  //   const hmisId = user.services && user.services.HMIS && user.services.HMIS.accountId;
  //   if (hmisId) {
  //     HmisClient.create(this.userId).api('user-service').deleteUser(hmisId);
  //   }
  //   Users.remove(userId);
  // },
});
