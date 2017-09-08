import winston from 'winston';
import Sentry from 'winston-sentry';
import moment from 'moment';

let log;


if (Meteor.isClient) {
  log = {
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
}

if (Meteor.isServer) {
  const settings = _.extend({
    level: 'error',
    dsn: '',
  }, Meteor.settings.sentry);

  log = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: 'debug',
        prettyPrint: true,
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: false,
      }),
      new Sentry({
        level: settings.level,
        dsn: settings.dsn,
        patchGlobal: true,
        release: moment(new Date()).format('YYYY-MM-DD'),
      }),
    ],
  });  
}

export const logger = log;
