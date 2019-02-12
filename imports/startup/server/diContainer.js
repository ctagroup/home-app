import awilix from 'awilix';
import {
  registerInjectedMeteorMethods,
  registerInjectedMeteorPublish,
} from '/imports/dependencyInjection';
import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import EnrollmentsRepository from '/imports/api/enrollments/enrollmentsRepository';
import EnrollmentsTranslationService from '/imports/api/enrollments/enrollmentsTranslationService';

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
  enrollmentsRepository: awilix.asClass(EnrollmentsRepository),
  enrollmentsTranslationService: awilix.asClass(EnrollmentsTranslationService),
});

registerInjectedMeteorMethods(container);
registerInjectedMeteorPublish(container);

export default container;
