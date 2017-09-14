import { logger } from '/imports/utils/logger';
import Messages from '/imports/api/messages/messages';

Meteor.methods(
  {
    addMessage(message) {
      logger.info(`METHOD[${Meteor.userId()}]: addMessage`, message);
      Messages.insert(message);
    },
  }
);

