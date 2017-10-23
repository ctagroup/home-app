import { logger } from '/imports/utils/logger';
import Questions from '/imports/api/questions/questions';


Meteor.publish('questions.all', () => {
  logger.info(`PUB[${this.userId}]: questions.all`);
  return Questions.find({ version: 2 });
});

Meteor.publish('questions.one', (id) => {
  check(id, String);
  logger.info(`PUB[${this.userId}]: questions.one`, id);
  return Questions.find({ _id: id, version: 2 });
});
