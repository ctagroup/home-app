/**
 * Created by udit on 21/06/16.
 */

logger = {
  log(msg) {
    Meteor.call('logToServerConsoleLog', msg);
  },
  debug(msg) {
    Meteor.call('logToServerConsoleDebug', msg);
  },
  info(msg) {
    Meteor.call('logToServerConsoleInfo', msg);
  },
  warn(msg) {
    Meteor.call('logToServerConsoleWarn', msg);
  },
  error(msg) {
    Meteor.call('logToServerConsoleError', msg);
  },
};
