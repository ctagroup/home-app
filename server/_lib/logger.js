/**
 * Created by udit on 21/06/16.
 */

import winston from 'winston';

logger = winston;
Meteor.methods(
  {
    logToServerConsoleLog: function(msg) {
      logger.log("(CLIENT) "+msg);
    },
    logToServerConsoleDebug: function(msg) {
      logger.debug("(CLIENT) "+msg);
    },
    logToServerConsoleInfo: function(msg) {
      logger.info("(CLIENT) "+msg);
    },
    logToServerConsoleWarn: function(msg) {
      logger.warn("(CLIENT) "+msg);
    },
    logToServerConsoleError: function(msg) {
      logger.error("(CLIENT) "+msg);
    },
  }
);
