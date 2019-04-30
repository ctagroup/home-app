import Sentry from '@sentry/node';
import { logger, sanitize } from '/imports/utils/logger';

const stringifyArgs = (...args) => args
  .map(sanitize)
  .map(JSON.stringify)
  .join(' ');

class SentryLogger {
  constructor({ sentryScope, loggerName }) {
    this.scope = sentryScope;
    this.name = loggerName;
  }

  debug(...args) {
    // this.scope.addBreadcrumb({
    //   message: stringifyArgs(...args),
    // });
    logger.debug(...args);
  }

  info(...args) {
    this.scope.addBreadcrumb({
      category: this.name,
      message: stringifyArgs(...args),
      level: Sentry.Severity.Info,
    });
    logger.info(...args);
  }

  warn(...args) {
    this.scope.addBreadcrumb({
      category: this.name,
      message: stringifyArgs(...args),
      level: Sentry.Severity.Warning,
    });
    logger.warn(...args);
  }

  error(...args) {
    this.scope.addBreadcrumb({
      category: this.name,
      message: stringifyArgs(...args),
      level: Sentry.Severity.Error,
    });
    logger.error(...args);
  }
}

export default SentryLogger;
