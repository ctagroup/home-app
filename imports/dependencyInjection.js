import awilix from 'awilix';
import { logger } from '/imports/utils/logger';
import Sentry from '@sentry/node';


export function registerInjectedMeteorMethods(container) {
  Meteor.injectedMethods = (methods, registerScopeCallback = null) => {
    const injectedMethods = Object.keys(methods).reduce((all, name) => { // eslint-disable-line
      return {
        ...all,
        [name](...args) {
          const methodWrapper = (ctx) => () => {
            const promise = new Promise((resolve, reject) => {
              Sentry.configureScope((scope) => {
                this.context = ctx;
                this.sentryScope = scope;
                scope.setUser({
                  id: this.userId,
                });
                scope.setTag('type', 'method');
                try {
                  logger.info(`METHOD ${name}[${this.userId}]: `, args);
                  const result = methods[name].call(this, ...args);
                  logger.debug(`METHOD ${name}[${this.userId}] succeeded`);
                  resolve(result);
                } catch (err) {
                  Sentry.captureException(err);
                  logger.error(`METHOD ${name}[${this.userId}] failed: `, err);
                  reject(err);
                }
              });
            });
            return promise;
          };
          const scope = container.createScope();
          scope.register({
            userId: awilix.asValue(this.userId),
            ...(registerScopeCallback ? registerScopeCallback() : {}),
            __injected_fcn__: awilix.asFunction(methodWrapper),
          });
          try {
            return scope.resolve('__injected_fcn__').call(this, ...args);
          } catch (err) {
            console.error(err); // eslint-disable-line
            throw err;
          }
        },
      };
    }, {});
    return Meteor.methods(injectedMethods);
  };
}

export function registerInjectedMeteorPublish(container) {
  Meteor.injectedPublish = (name, publishFcn, registerScopeCallback = null) => { // eslint-disable-line
    return Meteor.publish(name, function (...args) { // eslint-disable-line
      const publicationWrapper = (ctx) => {
        this.context = ctx;
        return publishFcn.bind(this);
      };
      const scope = container.createScope();
      scope.register({
        userId: awilix.asValue(this.userId),
        ...(registerScopeCallback ? registerScopeCallback() : {}),
        __injected_fcn__: awilix.asFunction(publicationWrapper),
      });
      try {
        return scope.resolve('__injected_fcn__')(...args);
      } catch (err) {
        console.error(err); // eslint-disable-line
        throw err;
      }
    });
  };
}
