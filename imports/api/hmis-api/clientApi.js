import { HmisApiRegistry } from './hmis-client';

export class ClientApi {
  createClient() {
    return 'bar';
  }

  getClients() {}

  getClient() {}

  getClientFromUrl() {}

  searchClient() {}

  getEnrollmentsForPublish() {}

  getEnrollmentExitsForPublish() {}

  createProjectSetup() {}
  getProjectsForPublish() {}
  getProjectForPublish() {}

  postQuestionAnswer() {}
}

HmisApiRegistry.addApi('client', ClientApi);
