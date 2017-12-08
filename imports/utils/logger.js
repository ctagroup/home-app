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
        stderrLevels: ['error'],
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

export function sanitize(obj, secrets = ['password', 'passwordConfirm', 'confirmPassword']) {
  if (Array.isArray(obj)) {
    return obj.map(x => sanitize(x, secrets));
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((o, key) => {
      const value = o[key];
      if (typeof value === 'string' && secrets.includes(key)) {
        return {
          ...o,
          [key]: '*****',
        };
      }
      return {
        ...o,
        [key]: sanitize(o[key]),
      };
    }, obj);
  }
  return obj;
}

export const logger = {
  debug(...params) {
    log.debug(...params.map(x => sanitize(x)));
  },

  info(...params) {
    log.info(...params.map(x => sanitize(x)));
  },

  warn(...params) {
    log.warn(...params.map(x => sanitize(x)));
  },

  error(...params) {
    log.error(...params.map(x => sanitize(x)));
  },
};
