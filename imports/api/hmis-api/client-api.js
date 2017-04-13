import { ApiEndpoint, HmisApiRegistry } from './api-registry';

const CLIENT_BASE_URL = 'https://www.hmislynk.com/hmis-clientapi/rest';

export class ClientApi extends ApiEndpoint {

  getClient() {}

  getClients() {
    const url = `${CLIENT_BASE_URL}/clients/`;
    const headers = {
      'X-HMIS-TrustedApp-Id': this.appId,
      Authorization: `HMISUserAuth session_token=${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let response;
    try {
      response = HTTP.get(url, { headers }).data;
    } catch (err) {
      this.throwApiError(url, headers, err);
    }
    return response.Clients.clients;
  }


  createClient() {
    return 'abcd';
  }

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
