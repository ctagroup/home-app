/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    getAllHomeRoles() {
      const homeRolesCollection = HomeUtils.adminCollectionObject('homeRoles');
      return homeRolesCollection.find({}).fetch();
    },
    insertHomeRole(data) {
      const homeRolesCollection = HomeUtils.adminCollectionObject('homeRoles');
      homeRolesCollection.insert(data);
    },
    generateDefaultHomeRoles() {
      const defaultHomeRoles = HomeConfig.defaultHomeRoles;
      for (let i = 0; i < defaultHomeRoles.length; i++) {
        Meteor.call('insertHomeRole', { title: defaultHomeRoles[i] });
      }
    },
    getAllHomePermissions() {
      return Roles.getAllRoles().fetch();
    },
    generateHomePermissions() {
      const defaultPermissions = HomeConfig.defaultPermissions;
      for (let i = 0; i < defaultPermissions.length; i++) {
        Roles.createRole(defaultPermissions[i]);
      }
    },
    getAllRolePermissions() {
      const rolePermissions = HomeUtils.adminCollectionObject('rolePermissions');
      return rolePermissions.find({}).fetch();
    },
    generateHomeRolePermissions() {
      const defaultHomeRoles = HomeConfig.defaultHomeRoles;
      for (let i = 0; i < defaultHomeRoles.length; i++) {
        if (HomeConfig && HomeConfig.defaultRolePermissions
            && HomeConfig.defaultRolePermissions[defaultHomeRoles[i]]) {
          const rolePermissions = HomeConfig.defaultRolePermissions[defaultHomeRoles[i]];
          for (let j = 0; j < rolePermissions.length; j++) {
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
        rolePermissions, (permission) => permission.permission
      );

      if (rolePermissions && rolePermissions.length > 0) {
        Roles.addUsersToRoles(userID, rolePermissions, Roles.GLOBAL_GROUP);
      }
    },
    removeUserFromRole(userID, role) {
      const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');
      let rolePermissions = rolePermissionsCollection.find({ role, value: true }).fetch();

      rolePermissions = _.map(
        rolePermissions, (permission) => permission.permission
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

      for (let i = 0; i < rolePermissions.length; i++) {
        let flag = false;
        let last = false;
        for (let j = 0; j < dataz; j++) {
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

      for (let i = 0; i < dataz.length; i++) {
        if (! dataz[i].processed) {
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
      const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');
      rolePermissionsCollection.remove({});
      Meteor.call('generateHomeRolePermissions');
    },
  }
);
