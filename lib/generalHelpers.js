/**
 * Created by udit on 29/04/16.
 */
HomeHelpers = {
  getCurrentUserGravatar() {
    const user = Meteor.user();
    const email = user && user.emails && user.emails[0].address || '';
    // email = Email.normalize( email );
    return `<img class="avatar small" src="${Gravatar.imageUrl(email, { secure: true })}" />`;
  },
  getCurrentUserFullName() {
    const user = Meteor.user();

    if (user && user.services && user.services.HMIS && user.services.HMIS.name) {
      return user.services.HMIS.name.trim();
    }

    if (user && user.services && user.services.HMIS
        && user.services.HMIS.firstName && user.services.HMIS.lastName) {
      return (
        `${user.services.HMIS.firstName.trim()} ${user.services.HMIS.lastName.trim()}`
      ).trim();
    }

    if (user && user.emails && user.emails[0].address) {
      return user.emails[0].address;
    }

    return '';
  },
  getOtherRoles(userId) {
    const homeRolesCollection = HomeUtils.adminCollectionObject('homeRoles');
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
    const homeRolesCollection = HomeUtils.adminCollectionObject('homeRoles');
    const defaultHomeRoles = homeRolesCollection.find({}).fetch();
    const rolePermissionsCollection = HomeUtils.adminCollectionObject('rolePermissions');

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
