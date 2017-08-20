import Surveys from '/imports/api/surveys/surveys';

Meteor.publish('surveys.all', () => Surveys.find());

Meteor.publish(
  'surveyQuestionsMaster', () => {
    if (typeof surveyQuestionsMaster === 'undefined') {
      return [];
    }
    return surveyQuestionsMaster.find({});
  }
);
