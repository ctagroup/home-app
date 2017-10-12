import { logger } from '/imports/utils/logger';
import Surveys from '/imports/api/surveys/surveys';

Meteor.publish('surveys.all', () => {
  logger.info(`PUB[${this.userId}]: surveys.all`);
  return Surveys.find({ version: 2 });
});
