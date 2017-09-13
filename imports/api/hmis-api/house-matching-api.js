import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

const BASE_URL = 'https://www.hmislynk.com/house-matching-api';

class HouseMatchingApi extends ApiEndpoint {
  getEligibleClients(pageNumber = 0, size = 9999) {
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

  getEligibleClient(clientId) {
    const url = `${BASE_URL}/eligibleclients/${clientId}`;
    return this.doGet(url);
  }

  updateEligibleClient(client) {
    const url = `${BASE_URL}/eligibleclients/${client.clientId}`;
    return this.doPut(url, client);
  }

  getHousingMatches(pageNumber = 0, size = 9999) {
    const url = `${BASE_URL}/matches?page=${pageNumber}&size=${size}`;
    const response = this.doGet(url);
    if (!response) {
      return [];
    }
    let housingMatches = response.content;
    if (response.page.number < response.page.totalPages - 1) {
      housingMatches = _.union(
        housingMatches,
        this.getHousingMatches(response.page.number + 1, response.page.size)
      );
    }
    return housingMatches;
  }

  getHousingMatch(clientId) {
    const url = `${BASE_URL}/matches/client/${clientId}`;
    return this.doGet(url);
  }

  getReferralStatusHistory(clientId) {
    const url = `${BASE_URL}/matches/client/${clientId}/status`;
    return this.doGet(url);
  }

  postHousingMatch() {
    const url = `${BASE_URL}/matches`;
    const body = {};
    return this.doPost(url, body);
  }
  postHousingMatchScores() {
    const url = `${BASE_URL}/scores`;
    const body = {}
    return this.doPost(url, body);
  }
  updateClientMatchStatus(clientId, status, comments = '', recipients = []) {
    const url = `${BASE_URL}/matches/client/${clientId}/status`;
    const body = { status, comments, recipients };
    return this.doPut(url, body);
  }

  getClientScore(clientId) {
    const url = `${BASE_URL}/scores/client/${clientId}`;
    const rawScore = this.doGet(url);
    const score = parseInt(rawScore.replace('score :', ''), 10);
    return score;
  }
}

HmisApiRegistry.addApi('house-matching', HouseMatchingApi);
