/**
 * Created by udit on 29/04/16.
 */
HomeHelpers = {
  getOtherRoles(userId) {
    const homeRolesCollection = adminCollectionObject('homeRoles');
    let defaultHomeRoles = homeRolesCollection.find({}).fetch();

    const userRoles = HomeHelpers.getUserRoles(userId);
    defaultHomeRoles = _.map(
      defaultHomeRoles, (role) => role.title
    );

    defaultHomeRoles = _.filter(
      defaultHomeRoles, (role) => {
        if (userRoles.indexOf(role) === - 1) {
          return true;
        }
        return false;
      }
    );

    return defaultHomeRoles;
  },
  getUserRoles(userId) {
    const currentRoles = [];
    const homeRolesCollection = adminCollectionObject('homeRoles');
    const defaultHomeRoles = homeRolesCollection.find({}).fetch();
    const rolePermissionsCollection = adminCollectionObject('rolePermissions');

    for (let i = 0; i < defaultHomeRoles.length; i ++) {
      const rolePermissions = rolePermissionsCollection.find(
        {
          role: defaultHomeRoles[i].title,
          value: true,
        }
      ).fetch();

      let flag = true;

      for (let j = 0; j < rolePermissions.length; j ++) {
        if (! Roles.userIsInRole(userId, rolePermissions[j].permission)) {
          flag = false;
          break;
        }
      }

      if (flag) {
        currentRoles.push(defaultHomeRoles[i].title);
      }
    }

    return currentRoles;
  },
};
