import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';


const BASE_URL = 'https://www.hmislynk.com/inventory-api/rest';
class HousingApi extends ApiEndpoint {
  getHousingUnits(pageNumber = 0, size = 1000) {
    const url = `${BASE_URL}/housing-units?page=${pageNumber}&size=${size}`;
    const response = this.doGet(url);
    let housingUnits = response.content;
    if (response.page.number < response.page.totalPages - 1) {
      housingUnits = _.union(
        housingUnits,
        this.getEligibleClients(response.page.number + 1, response.page.size)
      );
    }
    return housingUnits;
  }

  getHousingUnit(id) {
    const url = `${BASE_URL}/housing-units/${id}`;
    return this.doGet(url);
  }

  createHousingUnit(housingUnit) {
    const url = `${BASE_URL}/housing-units`;
    return this.doPost(url, housingUnit);
  }

  updateHousingUnit(id, housingUnit) {
    const url = `${BASE_URL}/housing-units/${id}`;
    return this.doPut(url, housingUnit);
  }

  deleteHousingUnit(id) {
    const url = `${BASE_URL}/housing-units/${id}`;
    return this.doDel(url);
  }

}

HmisApiRegistry.addApi('housing', HousingApi);
