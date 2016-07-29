/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'clients', () => {
    if (typeof clients === 'undefined') {
      return [];
    }
    return clients.find({});
  }
);
