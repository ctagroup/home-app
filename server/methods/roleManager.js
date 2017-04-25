/**
 * Created by udit on 26/07/16.
 */
import { logger } from '/imports/utils/logger';

Meteor.methods(
  {
    getAllHomeRoles() {
      return homeRoles.find({}).fetch();
    },
    insertHomeRole(data) {
      try {
        logger.info(data);
        homeRoles.insert(data);
      } catch (err) {
        logger.info(`Failed to insert home role. ${err.message}`);
        logger.info(JSON.stringify(err));
      }
    },
    generateDefaultHomeRoles() {
      const defaultHomeRoles = HomeConfig.defaultHomeRoles;
      for (let i = 0; i < defaultHomeRoles.length; i += 1) {
        if (!homeRoles.findOne({ title: defaultHomeRoles[i] })) {
          Meteor.call('insertHomeRole', { title: defaultHomeRoles[i] });
        }
      }
    },
    getAllHomePermissions() {
      return Roles.getAllRoles().fetch();
    },
    generateHomePermissions() {
      const defaultPermissions = HomeConfig.defaultPermissions;
      for (let i = 0; i < defaultPermissions.length; i += 1) {
        Roles.createRole(defaultPermissions[i]);
      }
    },
    getAllRolePermissions() {
      return rolePermissions.find({}).fetch();
    },
    generateHomeRolePermissions() {
      const defaultHomeRoles = HomeConfig.defaultHomeRoles;
      for (let i = 0; i < defaultHomeRoles.length; i += 1) {
        if (HomeConfig && HomeConfig.defaultRolePermissions
            && HomeConfig.defaultRolePermissions[defaultHomeRoles[i]]) {
          const rolePermissions = HomeConfig.defaultRolePermissions[defaultHomeRoles[i]];
          for (let j = 0; j < rolePermissions.length; j += 1) {
            const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');
            rolePermissionsCollection.insert(
              {
                role: defaultHomeRoles[i],
                permission: rolePermissions[j],
                value: true,
              }
            );
          }
        }
      }
    },
    addUserToRole(userID, role) {
      const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');
      let rolePermissions = rolePermissionsCollection.find({ role, value: true }).fetch();

      rolePermissions = _.map(
        rolePermissions, permission => permission.permission
      );

      if (rolePermissions && rolePermissions.length > 0) {
        Roles.addUsersToRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
      }
    },
    removeUserFromRole(userID, role) {
      const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');
      let rolePermissions = rolePermissionsCollection.find({ role, value: true }).fetch();

      rolePermissions = _.map(
        rolePermissions, permission => permission.permission
      );

      rolePermissions = _.filter(
        rolePermissions, (permission) => {
          let userRoles = HomeHelpers.getUserRoles(userID);
          userRoles = _.filter(
            userRoles, (userRole) => {
              if (userRole === role) {
                return false;
              }
              return true;
            }
          );

          if (userRoles && userRoles.length > 0) {
            const otherRolesWithPermission = rolePermissionsCollection.find(
              {
                permission,
                role: { $in: userRoles },
                value: true,
              }
            ).fetch();
            if (otherRolesWithPermission.length > 0) {
              return false;
            }
          }

          return true;
        }
      );

      if (rolePermissions && rolePermissions.length > 0) {
        Roles.removeUsersFromRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
      }
    },
    updateRolePermissions(data) {
      const dataz = data;
      const rolePermissions = Meteor.call('getAllRolePermissions');
      const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');

      for (let i = 0; i < rolePermissions.length; i += 1) {
        let flag = false;
        let last = false;
        for (let j = 0; j < dataz; j += 1) {
          if (dataz[j].name ===
              `rolePermissions[${rolePermissions[i].permission}][${rolePermissions[i].role}]`) {
            flag = j;
            break;
          }
          last = j;
        }

        if (flag) {
          rolePermissionsCollection.upsert(
            { role: rolePermissions[i].role, permission: rolePermissions[i].permission }, {
              $set: {
                role: rolePermissions[i].role,
                permission: rolePermissions[i].permission,
                value: true,
              },
            }
          );
          dataz[flag].processed = true;
        } else {
          rolePermissionsCollection.upsert(
            { role: rolePermissions[i].role, permission: rolePermissions[i].permission }, {
              $set: {
                role: rolePermissions[i].role,
                permission: rolePermissions[i].permission,
                value: false,
              },
            }
          );
          if (last) {
            dataz[last].processed = true;
          }
        }
      }

      for (let i = 0; i < dataz.length; i += 1) {
        if (!dataz[i].processed) {
          rolePermissionsCollection.upsert(
            { role: dataz[i].role, permission: dataz[i].permission }, {
              $set: {
                role: dataz[i].role,
                permission: dataz[i].permission,
                value: false,
              },
            }
          );
          dataz[i].processed = false;
        }
      }

      return dataz;
    },
    resetRolePermissions() {
      homeRoles.remove({});
      rolePermissions.remove({});
      Meteor.call('generateDefaultHomeRoles');
      Meteor.call('generateHomeRolePermissions');
    },
  }
);
