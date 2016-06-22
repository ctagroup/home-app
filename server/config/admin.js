/**
 * Created by udit on 22/06/16.
 */

Meteor.startup(
  () => {
    // Create Default home Roles
    const homeRoles = Meteor.call('getAllHomeRoles');
    if (homeRoles.length === 0) {
      Meteor.call('generateDefaultHomeRoles');
    }

    // Create Default Permissions - Roles in case of Meteor Roles Package
    const homePermissions = Meteor.call('getAllHomePermissions');
    if (homePermissions.length === 0) {
      Meteor.call('generateHomePermissions');
    }

    // Map Roles with Capabilities
    const homeRolePermissions = Meteor.call('getAllRolePermissions');
    if (homeRolePermissions.length === 0) {
      Meteor.call('generateHomeRolePermissions');
    }

    // Check Roles of Developer Users
    const emails = AdminConfig.adminEmails;
    for (let i = 0; i < emails; i ++) {
      const devUser = Meteor.users.find(
        {
          emails: {
            $elemMatch: {
              address: emails[i],
            },
          },
        }
      ).fetch();
      if (devUser.length > 0) {
        if (! Roles.userIsInRole(devUser[0]._id, 'Developer')) {
          Meteor.call('addUserToRole', devUser[0]._id, 'Developer');
        }
      }
    }
  }
);
