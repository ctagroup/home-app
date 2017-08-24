import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';


const BASE_URL = 'https://www.hmislynk.com/inventory-api/rest';
class HousingApi extends ApiEndpoint {
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
    return this.doDelete(url);
  }

  getHousingUnitsForPublish() {
    throw new Error('Not yet implemented');
  }

  getHousingUnitForPublish() {
    throw new Error('Not yet implemented');
  }
}

HmisApiRegistry.addApi('housing', HousingApi);
