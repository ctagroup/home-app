// import { logger } from '/imports/utils/logger';
import awilix from 'awilix';
import Sentry from '@sentry/node';
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
