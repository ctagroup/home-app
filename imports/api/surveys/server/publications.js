import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';
import SurveyQuestionsMaster from '/imports/api/surveys/surveyQuestionsMaster';

Meteor.publish('surveys.all', function publishAllSurveys() {
  logger.info(`PUB[${this.userId}]: surveys.all`);
  return Surveys.find({ version: 2 });
});

Meteor.publish('surveys.one', function publishOneSurvey(_id) {
  logger.info(`PUB[${this.userId}]: surveys.one`, _id);
  return Surveys.find({ _id, version: 2 });
});

Meteor.publish('surveys.v1', function publishAllSurveys() {
  logger.info(`PUB[${this.userId}]: surveys.v1`);
  return [
    Surveys.find({ version: 1 }),
    SurveyQuestionsMaster.find(),
  ];
});

