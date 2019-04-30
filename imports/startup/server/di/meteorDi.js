// import { logger } from '/imports/utils/logger';
import awilix from 'awilix';
import Sentry from '@sentry/node';
import Future from 'fibers/future';
import { setupEndpointDependencies } from './diSetup';


export function registerInjectedMeteorMethods(container) {
  Meteor.injectedMethods = (methods, setupDependenciesCallback = setupEndpointDependencies) => {
    const injectedMethods = Object.keys(methods).reduce((all, name) => { // eslint-disable-line
      return {
        ...all,
        [name](...args) {
          const methodWrapper = (ctx) => () => {
            this.context = ctx;
            return methods[name].call(this, ...args);
          };

          const methodPromise = new Promise((resolve, reject) => {
            Sentry.withScope((sentryScope) => {
              // configure sentry scope
              sentryScope.setUser({
                id: this.userId,
              });
              sentryScope.setTags({
                type: 'method',
                name,
              });

              sentryScope.addBreadcrumb({ message: `calling ${name}` });

              // configure DI
              const containerScope = container.createScope();
              containerScope.register({
                userId: awilix.asValue(this.userId),
                sentryScope: awilix.asValue(sentryScope),
                __injected_fcn__: awilix.asFunction(methodWrapper),
              });

              if (typeof(setupDependenciesCallback) === 'function') {
                setupDependenciesCallback(`method.${name}`, containerScope);
              }

              // call method with injected dependencies
              try {
                const result = containerScope.resolve('__injected_fcn__').call(this, ...args);
                resolve(result);
              } catch (err) {
                sentryScope.addBreadcrumb({
                  category: 'stack trace',
                  message: err.stack,
                  level: Sentry.Severity.Error,
                });
                Sentry.captureException(err);
                reject(err);
              }
            });
          });

          return methodPromise;
        },
      };
    }, {});
    return Meteor.methods(injectedMethods);
  };
}

export function registerInjectedMeteorPublish(container) {
  Meteor.injectedPublish = (name, publishFcn, setupDependenciesCallback = setupEndpointDependencies) => { // eslint-disable-line
    return Meteor.publish(name, function (...args) { // eslint-disable-line
      const publicationWrapper = (ctx) => {
        this.context = ctx;
        return publishFcn.bind(this);
      };

      const future = new Future();

      Sentry.withScope((sentryScope) => {
        // configure sentry scope
        sentryScope.setUser({
          id: this.userId,
        });
        sentryScope.setTags({
          type: 'publication',
          name,
        });

        sentryScope.addBreadcrumb({ message: `calling ${name}` });

        // configure DI
        const containerScope = container.createScope();
        containerScope.register({
          userId: awilix.asValue(this.userId),
          sentryScope: awilix.asValue(sentryScope),
          __injected_fcn__: awilix.asFunction(publicationWrapper),
        });

        if (typeof(setupDependenciesCallback) === 'function') {
          setupDependenciesCallback(`publication.${name}`, containerScope);
        }

        // call publication with injected dependencies
        try {
          const result = containerScope.resolve('__injected_fcn__')(...args);
          future.return(result);
        } catch (err) {
          Sentry.captureException(err);
          future.throw(err);
        }
      });

      return future.wait();
    });
  };
}
