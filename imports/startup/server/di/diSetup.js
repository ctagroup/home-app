import awilix from 'awilix';
import { logger as globalLogger } from '/imports/utils/logger';
import SentryLogger from '/imports/utils/sentryLogger';
import { HmisClient } from '/imports/api/hmisApi';
import { HmisCache, HmisCacheCollection } from '/imports/api/cache/hmisCache';
import { HmisApiRegistry } from '/imports/api/hmisApi/apiRegistry';
import EnrollmentsRepository from '/imports/api/enrollments/enrollmentsRepository';
import EnrollmentsTranslationService from '/imports/api/enrollments/enrollmentsTranslationService';
import Responses from '/imports/api/responses/responses';
import ResponsesRepository from '/imports/api/responses/ResponsesRepository';


function createHmisClient({ userId }) {
  return HmisClient.create(userId);
}

function getServiceConfiguration() {
  return ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
}

export function setupInitialDependencies(container) {
  container.register({
    hmisApiRegistry: awilix.asValue(HmisApiRegistry),
    hmisCacheCollection: awilix.asValue(HmisCacheCollection),
    hmisClient: awilix.asFunction(createHmisClient),
    logger: awilix.asValue(globalLogger),
    responsesCollection: awilix.asValue(Responses),
    serviceConfig: awilix.asFunction(getServiceConfiguration),
    usersCollection: awilix.asValue(Meteor.users),
  });
}

export function setupEndpointDependencies(endpointName, container) {
  if (endpointName.startsWith('method') || endpointName.startsWith('publication')) {
    container.register({
      endpointName: awilix.asValue(endpointName),
      enrollmentsRepository: awilix.asClass(EnrollmentsRepository),
      enrollmentsTranslationService: awilix.asClass(EnrollmentsTranslationService),
      hmisCache: awilix.asClass(HmisCache),
      hmisClient: awilix.asClass(HmisClient),
      loggerName: awilix.asValue(endpointName),
      logger: awilix.asClass(SentryLogger),
      responsesRepository: awilix.asClass(ResponsesRepository),
    });
  }

  if (endpointName.startsWith('publication.enrollments.one')) {
    container.register({
      enrollmentsRepository: awilix.asClass(EnrollmentsRepository),
      enrollmentsTranslationService: awilix.asClass(EnrollmentsTranslationService),
    });
  }
}
