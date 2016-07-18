/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'homeRoles', () => {
    if (typeof homeRoles === 'undefined') {
      return [];
    }
    return homeRoles.find({});
  }
);

Meteor.publish(
  'rolePermissions', () => {
    if (typeof rolePermissions === 'undefined') {
      return [];
    }
    return rolePermissions.find({});
  }
);
