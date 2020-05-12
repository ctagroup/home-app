import querystring from 'querystring';
import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://api.hslynk.com/house-matching-api';

class HouseMatchingApi extends ApiEndpoint {
  getEligibleClients(
    pageNumber = 0,
    size = 9999,
    sort = 'firstName',
    order = 'desc'
  ) {
    const params = {
      page: pageNumber,
      size,
      sort,
      order, // asc-desc
    };
    const url = `${BASE_URL}/v2/eligibleclients?${querystring.stringify(
      params
    )}`;
    // const url = `${BASE_URL}/v2/eligibleclients?page=${pageNumber}&size=${size}`;
    // totalElements
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

  getEligibleClientsPage(
    pageNumber = 0,
    size = 9999,
    sort = 'firstName',
    order = 'desc'
  ) {
    const params = {
      page: pageNumber,
      size,
    };
    if (sort) params.sort = sort;
    if (order) params.order = order;
    const url = `${BASE_URL}/v3/eligibleclients?${querystring.stringify(
      params
    )}`;
    const response = this.doGet(url);
    // console.log('getEligibleClientsPage', url, response);
    return response;
  }

  getEligibleClient(clientId) {
    const url = `${BASE_URL}/v2/eligibleclients/${clientId}`;
    return this.doGet(url);
  }
}

HmisApiRegistry.addApi('house-matching-v2', HouseMatchingApi);
