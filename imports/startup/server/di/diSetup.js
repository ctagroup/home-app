import uuidv4 from 'uuid/v4';
import awilix from 'awilix';
import { logger as globalLogger } from '/imports/utils/logger';
import SentryLogger from '/imports/utils/sentryLogger';
import { HmisClient } from '/imports/api/hmisApi';
import { HmisCache, HmisCacheCollection } from '/imports/api/cache/hmisCache';
import { HmisApiRegistry } from '/imports/api/hmisApi/apiRegistry';
import ClientsRepository from '/imports/api/clients/clientsRepository';
import EnrollmentsRepository from '/imports/api/enrollments/enrollmentsRepository';
import EnrollmentsTranslationService from '/imports/api/enrollments/enrollmentsTranslationService';
import Responses from '/imports/api/responses/responses';
import ResponsesRepository from '/imports/api/responses/ResponsesRepository';
import AuditLog from '/imports/api/eventLog/AuditLog';

function createHmisClient({ userId }) {
  return HmisClient.create(userId);
}

function getServiceConfiguration() {
  return ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
}

export function setupInitialDependencies(container) {
  container.register({
    auditLog: awilix.asClass(AuditLog),
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
      clientsRepository: awilix.asClass(ClientsRepository),
      endpointName: awilix.asValue(endpointName),
      eventId: awilix.asFunction(() => uuidv4()),
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
