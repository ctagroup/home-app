/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'questions', () => {
    if (typeof questions === 'undefined') {
      return [];
    }
    return questions.find({});
  }
);
