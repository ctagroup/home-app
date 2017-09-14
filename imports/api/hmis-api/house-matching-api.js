import { logger } from '/imports/utils/logger';
import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

const BASE_URL = 'https://www.hmislynk.com/house-matching-api';

class HouseMatchingApi extends ApiEndpoint {
  getEligibleClients(pageNumber = 0, size = 9999) {
    const url = `${BASE_URL}/eligibleclients?page=${pageNumber}&size=${size}`;
    const response = this.doGet(url);
    if (response === null) {
      logger.warn('HouseMatchingApi.getEligibleClients returned null response');
      // see https://github.com/servinglynk/hmis-lynk-open-source-docs/issues/337
      return [];
    }
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
      // see https://github.com/servinglynk/hmis-lynk-open-source-docs/issues/337
      logger.warn('HouseMatchingApi.getHousingMatches returned null response', response);
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
    throw new Meteor.Error(500, 'Not yet implemented');
    // const url = `${BASE_URL}/matches`;
    // const body = {};
    // return this.doPost(url, body);
  }
  postHousingMatchScores() {
    throw new Meteor.Error(500, 'Not yet implemented');
    // const url = `${BASE_URL}/scores`;
    // const body = {};
    // return this.doPost(url, body);
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
