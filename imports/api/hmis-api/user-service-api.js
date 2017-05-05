import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';


const BASE_URL = 'https://www.hmislynk.com/hmis-user-service/rest';


class UserServiceApi extends ApiEndpoint {
  getProjectGroups() {
    throw new Error('Not yet implemented');
  }

  getUserProfiles() {
    throw new Error('Not yet implemented');
  }

  getRoles() {
    throw new Error('Not yet implemented');
  }

  createUser() {
    throw new Error('Not yet implemented');
  }

  updateUser() {
    throw new Error('Not yet implemented');
  }

  changePassword() {
    throw new Error('Not yet implemented');
  }

  updateUserRoles() {
    throw new Error('Not yet implemented');
  }

  deleteUserRole() {
    throw new Error('Not yet implemented');
  }

  getUser(accountId) {
    const url = `${BASE_URL}/accounts/${accountId}`;
    return this.doGet(url).account;
  }

  promiseGetUser(accountId) {
    const url = `${BASE_URL}/accounts/${accountId}`;
    return this.promisedGet(url).then((data) => new Promise((resolve) => {
      resolve(data.account);
    }));
  }
}

HmisApiRegistry.addApi('user-service', UserServiceApi);
