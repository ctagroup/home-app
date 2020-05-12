import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://api.hslynk.com/house-matching-api';

class HouseMatchingApi3 extends ApiEndpoint {
  getEligibleClient(dedupClientId) {
    const url = `${BASE_URL}/v3/eligibleclients/${dedupClientId}`;
    return this.doGet(url);
  }

  updateEligibleClient(dedupClientId, data) {
    const url = `${BASE_URL}/v3/eligibleclients/${dedupClientId}`;
    return this.doPut(url, data);
  }
}

HmisApiRegistry.addApi('house-matching-v3', HouseMatchingApi3);
