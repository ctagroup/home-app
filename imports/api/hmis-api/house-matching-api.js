import { ApiEndpoint, HmisApiRegistry } from './api-registry';

const BASE_URL = 'https://www.hmislynk.com/house-matching-api';

class HouseMatchingApi extends ApiEndpoint {
  getEligibleClients(pageNumber = 0) {
    const headers = this.getRequestHeaders();
    const url = `${BASE_URL}/eligibleclients?page=${pageNumber}&size=1000`;
    let eligibleClients = [];
    try {
      const response = HTTP.get(url, { headers }).data;
      eligibleClients = response.content;
      if (response.page.number < response.page.totalPages - 1) {
        eligibleClients = _.union(
          eligibleClients,
          this.getEligibleClients(response.page.number + 1)
        );
      }
    } catch (err) {
      this.throwApiError(url, headers, err);
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
