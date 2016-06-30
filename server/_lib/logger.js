/**
 * Created by udit on 21/06/16.
 */

import winston from 'winston';

logger = winston;
Meteor.methods(
  {
    logToServerConsoleLog(msg) {
      logger.info(`(CLIENT) ${msg}`);
    },
    logToServerConsoleDebug(msg) {
      logger.debug(`(CLIENT) ${msg}`);
    },
    logToServerConsoleInfo(msg) {
      logger.info(`(CLIENT) ${msg}`);
    },
    logToServerConsoleWarn(msg) {
      logger.warn(`(CLIENT) ${msg}`);
    },
    logToServerConsoleError(msg) {
      logger.error(`(CLIENT) ${msg}`);
    },
  }
);
