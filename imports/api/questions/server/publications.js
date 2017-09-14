import { logger } from '/imports/utils/logger';
import Questions from '/imports/api/questions/questions';


Meteor.publish('questions.all', () => {
  logger.info(`PUB[${this.userId}]: qustions.all`);
  return Questions.find();
});
