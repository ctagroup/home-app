import Surveys from '/imports/api/surveys/surveys';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';

Meteor.publish('surveys.all', () => [
  Surveys.find(),
  SurveyQuestionsMaster.find(),
]);

Meteor.publish(
  'surveyQuestionsMaster', () => {
    if (typeof surveyQuestionsMaster === 'undefined') {
      return [];
    }
    return SurveyQuestionsMaster.find();
  }
);
