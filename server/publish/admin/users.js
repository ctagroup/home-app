/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'users', () => {
    if (typeof users === 'undefined') {
      return [];
    }
    return users.find({});
  }
);
