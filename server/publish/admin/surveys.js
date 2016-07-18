/**
 * Created by udit on 15/07/16.
 */

Meteor.publish(
  'surveys', () => {
    if (typeof surveys === 'undefined') {
      return [];
    }
    return surveys.find({});
  }
);

Meteor.publish(
  'surveyQuestionsMaster', () => {
    if (typeof surveyQuestionsMaster === 'undefined') {
      return [];
    }
    return surveyQuestionsMaster.find({});
  }
);

Meteor.publish(
  'responses', () => {
    if (typeof responses === 'undefined') {
      return [];
    }
    return responses.find({});
  }
);
