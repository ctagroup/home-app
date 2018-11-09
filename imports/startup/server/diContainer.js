import awilix from 'awilix';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  connectionString: awilix.asValue('sample-connection-string'),
});

Meteor.injectedMethods = (methods) => {
  const injectedMethods = Object.keys(methods).reduce((all, name) => { // eslint-disable-line
    return {
      [name](...args) {
        const scope = container.createScope();
        const builder = (ctx) => () => methods[name].call(this, ...args, ctx);
        scope.register({
          [name]: awilix.asFunction(builder),
        });
        return scope.resolve(name).call(this, ...args);
      },
    };
  }, {});
  Meteor.methods(injectedMethods);
};

export default container;
