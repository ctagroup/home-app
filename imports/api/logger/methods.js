import { logger } from '/imports/utils/logger';

Meteor.methods({
  logToServerConsoleLog(msg) {
    logger.log('info', `(CLIENT) ${JSON.stringify(msg)}`);
  },
  logToServerConsoleDebug(msg) {
    logger.debug(`(CLIENT) ${JSON.stringify(msg)}`);
  },
  logToServerConsoleInfo(msg) {
    logger.info(`(CLIENT) ${JSON.stringify(msg)}`);
  },
  logToServerConsoleWarn(msg) {
    logger.warn(`(CLIENT) ${JSON.stringify(msg)}`);
  },
  logToServerConsoleError(msg) {
    logger.error(`(CLIENT) ${JSON.stringify(msg)}`);
  },
});
