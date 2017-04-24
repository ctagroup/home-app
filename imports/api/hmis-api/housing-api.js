import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

class HousingApi extends ApiEndpoint {
  createHousingUnit() {
    throw new Error('Not yet implemented');
  }

  updateHousingUnit() {
    throw new Error('Not yet implemented');
  }

  deleteHousingUnit() {
    throw new Error('Not yet implemented');
  }

  getHousingUnitsForPublish() {
    throw new Error('Not yet implemented');
  }

  getHousingUnitForPublish() {
    throw new Error('Not yet implemented');
  }
}

HmisApiRegistry.addApi('housing', HousingApi);
