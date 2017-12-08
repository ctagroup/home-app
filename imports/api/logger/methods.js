import { logger, sanitize } from '/imports/utils/logger';

Meteor.methods({
  logToServerConsoleLog(...params) {
    logger.log('info', '(CLIENT)', params.map(x => sanitize(x)));
  },
  logToServerConsoleDebug(...params) {
    logger.debug('(CLIENT)', params.map(x => sanitize(x)));
  },
  logToServerConsoleInfo(...params) {
    logger.info('(CLIENT)', params.map(x => sanitize(x)));
  },
  logToServerConsoleWarn(...params) {
    logger.warn('(CLIENT)', ...params.map(x => sanitize(x)));
  },
  logToServerConsoleError(...params) {
    logger.error('(CLIENT)', params.map(x => sanitize(x)));
  },
});
