import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';


const BASE_URL = 'https://www.hmislynk.com/hmis-user-service/rest';


class UserServiceApi extends ApiEndpoint {
  createUser() {
    throw new Error('Not yet implemented');
  }

  updateUser(userId, data) {
    const url = `${BASE_URL}/accounts/${userId}`;
    return this.doPut(url, { account: data });
  }

  updateUserRoles(userId, roles) {
    const url = `${BASE_URL}/accounts/${userId}/roles`;
    return this.doPut(url, { roles });
  }

  getProjectGroups() {
    throw new Error('Not yet implemented');
  }

  getUserProfiles() {
    const url = `${BASE_URL}/profiles?startIndex=0&maxItems=10000`;
    return this.doGet(url).profiles.profile;
  }

  getRoles() {
    const url = `${BASE_URL}/roles?startIndex=0&maxItems=10000`;
    return this.doGet(url).roles.role;
  }

  changeOwnPassword(currentPassword, newPassword, confirmNewPassword) {
    const url = `${BASE_URL}/accounts/self/passwordchanges`;
    const passwordChange = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };
    return this.doPut(url, { passwordChange });
  }


  deleteUserRole() {
    throw new Error('Not yet implemented');
  }

  getUser(accountId) {
    const url = `${BASE_URL}/accounts/${accountId}`;
    return this.doGet(url).account;
  }
}

HmisApiRegistry.addApi('user-service', UserServiceApi);
