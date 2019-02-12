import awilix from 'awilix';


export function registerInjectedMeteorMethods(container) {
  Meteor.injectedMethods = (methods, registerScopeCallback = null) => {
    const injectedMethods = Object.keys(methods).reduce((all, name) => { // eslint-disable-line
      return {
        ...all,
        [name](...args) {
          const scope = container.createScope();
          const builder = (ctx) => () => {
            this.context = ctx;
            return methods[name].call(this, ...args);
          };
          scope.register({
            userId: awilix.asValue(this.userId),
            ...(registerScopeCallback ? registerScopeCallback() : {}),
            __injected_fcn__: awilix.asFunction(builder),
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
      const builder = (ctx) => {
        this.context = ctx;
        return publishFcn.bind(this);
      };
      const scope = container.createScope();
      scope.register({
        userId: awilix.asValue(this.userId),
        ...(registerScopeCallback ? registerScopeCallback() : {}),
        __injected_fcn__: awilix.asFunction(builder),
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
