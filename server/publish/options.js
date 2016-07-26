/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'options', () => {
    if (typeof options === 'undefined') {
      return [];
    }
    return options.find({});
  }
);
