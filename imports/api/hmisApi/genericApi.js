import { HmisApiRegistry } from './apiRegistry';
import { ApiEndpoint } from './apiEndpoint';

const BASE_URL = 'https://www.hmislynk.com';

export class GenericApi extends ApiEndpoint {
  getData(relativeUrl, data) {
    const url = relativeUrl.startsWith('/') ?
      `${BASE_URL}${relativeUrl}` : `${BASE_URL}/${relativeUrl}`;
    return this.doGet(url, data);
  }
}

HmisApiRegistry.addApi('generic', GenericApi);
