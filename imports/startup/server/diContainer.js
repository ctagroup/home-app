import awilix from 'awilix';
import { HmisClient } from '/imports/api/hmisApi';


function hmisClientFactory({ userId }) {
  console.log('aaa');
  return HmisClient.create(userId);
}

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  connectionString: awilix.asValue('sample-connection-string'),
  hmisClient: awilix.asFunction(hmisClientFactory),
});

Meteor.injectedMethods = (methods, registerScopeCallback = null) => {
  const injectedMethods = Object.keys(methods).reduce((all, name) => { // eslint-disable-line
    return {
      ...all,
      [name](...args) {
        const scope = container.createScope();
        // TODO: get number of arguments, default values??
        const builder = (ctx) => () => {
          this.context = ctx;
          methods[name].call(this, ...args);
        };
        scope.register({
          userId: awilix.asValue(this.userId),
          [name]: awilix.asFunction(builder),
        });
        if (registerScopeCallback) {
          const data = registerScopeCallback() || {};
          scope.register(data);
        }
        try {
          return scope.resolve(name).call(this, ...args);
        } catch (err) {
          console.error(err); // eslint-disable-line
          throw err;
        }
      },
    };
  }, {});
  return Meteor.methods(injectedMethods);
};

Meteor.injectedPublish = (name, publishFcn, registerScopeCallback = null) => {
  /*
  const builder = (ctx) => {
    this.context = ctx;
    console.log('builder', ctx);
    console.log('TODO: call publish');
  };

  const scope = container.createScope();
  scope.register({
    userId: awilix.asValue(this.userId),
    fcn: awilix.asFunction(builder),
  });
  if (registerScopeCallback) {
    const data = registerScopeCallback() || {};
    scope.register(data);
  }

  console.log('xxx', scope.resolve('fcn'), scope.resolve('userId'));
  */
  return Meteor.publish(name, function () {
    const builder = (ctx) => {
      this.context = ctx;
      return publishFcn;
    };
    const scope = container.createScope();
    scope.register({
      userId: awilix.asValue(this.userId),
      builderFcn: awilix.asFunction(builder),
    });

    // console.log('todo', scope.resolve('builderFcn'), scope.resolve('userId'));
    return scope.resolve('builderFcn').call(this);
  });
};

export default container;
