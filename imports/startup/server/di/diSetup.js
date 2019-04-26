import awilix from 'awilix';
import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import EnrollmentsRepository from '/imports/api/enrollments/enrollmentsRepository';
import EnrollmentsTranslationService from '/imports/api/enrollments/enrollmentsTranslationService';


function hmisClientFactory({ userId }) {
  return HmisClient.create(userId);
}

export function setupInitialDependencies(container) {
  container.register({
    hmisClient: awilix.asFunction(hmisClientFactory),
    logger: awilix.asValue(logger),
    enrollmentsRepository: awilix.asClass(EnrollmentsRepository),
    enrollmentsTranslationService: awilix.asClass(EnrollmentsTranslationService),
  });
}

export function setupEndpointDependencies(endpointName, container) {
  if (endpointName.startsWith('method')) {
    container.register({
      endpointName: awilix.asValue(endpointName),
    });
  }
}
