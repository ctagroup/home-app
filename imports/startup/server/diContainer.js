import awilix from 'awilix';
import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import {
  registerInjectedMeteorMethods,
  registerInjectedMeteorPublish,
} from '/imports/dependencyInjection';


function hmisClientFactory({ userId }) {
  return HmisClient.create(userId);
}

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  connectionString: awilix.asValue('sample-connection-string'),
  hmisClient: awilix.asFunction(hmisClientFactory),
  logger: awilix.asValue(logger),
});

registerInjectedMeteorMethods(container);
registerInjectedMeteorPublish(container);

export default container;
