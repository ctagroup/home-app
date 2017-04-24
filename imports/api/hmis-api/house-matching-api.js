import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

const BASE_URL = 'https://www.hmislynk.com/house-matching-api';

class HouseMatchingApi extends ApiEndpoint {
  updateEligibleClient(client) {
    const url = `${BASE_URL}/eligibleclients/${client.clientId}`;
    return this.doPut(url, client);
  }

  getEligibleClient(clientId) {
    const url = `${BASE_URL}/eligibleclients/${clientId}`;
    return this.doGet(url);
  }

  getEligibleClients(pageNumber = 0, size = 1000) {
    const url = `${BASE_URL}/eligibleclients?page=${pageNumber}&size=${size}`;
    const response = this.doGet(url);
    let eligibleClients = response.content;
    if (response.page.number < response.page.totalPages - 1) {
      eligibleClients = _.union(
        eligibleClients,
        this.getEligibleClients(response.page.number + 1, response.page.size)
      );
    }
    return eligibleClients;
  }

  getHousingMatchForPublish() {
    throw new Error('Not yet implemented');
  }
  getSingleHousingMatchForPublish() {
    throw new Error('Not yet implemented');
  }
  getReferralStatusHistory() {
    throw new Error('Not yet implemented');
  }
  postHousingMatch() {
    throw new Error('Not yet implemented');
  }
  postHousingMatchScores() {
    throw new Error('Not yet implemented');
  }
  updateClientMatchStatus() {
    throw new Error('Not yet implemented');
  }
  getClientScore() {
    throw new Error('Not yet implemented');
  }
}

HmisApiRegistry.addApi('house-matching', HouseMatchingApi);
