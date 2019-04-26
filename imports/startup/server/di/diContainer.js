import awilix from 'awilix';
import {
  registerInjectedMeteorMethods,
  registerInjectedMeteorPublish,
} from '/imports/startup/server/di/meteorDi.js';
import { setupInitialDependencies } from '/imports/startup/server/di/diSetup';

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

setupInitialDependencies(container);

registerInjectedMeteorMethods(container);
registerInjectedMeteorPublish(container);

export default container;
