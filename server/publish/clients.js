/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'clientInfo', () => {
    if (typeof clientInfo === 'undefined') {
      return [];
    }
    return clientInfo.find({});
  }
);
