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
        const builder = (ctx) => () => methods[name].call(this, ...args, ctx);
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
  console.log(injectedMethods);
  Meteor.methods(injectedMethods);
};

export default container;
