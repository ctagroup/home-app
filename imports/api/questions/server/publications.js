import { logger } from '/imports/utils/logger';
import Questions from '/imports/api/questions/questions';


Meteor.publish('questions.all', () => {
  logger.info(`PUB[${this.userId}]: questions.all`);
  return Questions.find();
});
