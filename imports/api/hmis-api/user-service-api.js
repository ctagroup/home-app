import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';


const BASE_URL = 'https://www.hmislynk.com/hmis-user-service/rest';


class UserServiceApi extends ApiEndpoint {
  createUser(account) {
    const url = `${BASE_URL}/accounts`;
    const body = { account };
    return this.doPost(url, body);
  }

  updateUser(userId, data) {
    const url = `${BASE_URL}/accounts/${userId}`;
    return this.doPut(url, { account: data });
  }

  updateUserRoles(userId, roles) {
    const body = {
      roles: {
        role: roles,
      },
    };
    const url = `${BASE_URL}/accounts/${userId}/roles`;
    return this.doPut(url, body);
  }

  getProjectGroups() {
    // https://www.hmislynk.com/hmis-user-service/rest/projectgroups
    throw new Error('Not yet implemented');
  }

  getUserProfiles(start = 0, limit = 1000) {
    const url = `${BASE_URL}/profiles?startIndex=${start}&maxItems=${limit}`;
    return this.doGet(url).profiles.profile;
  }

  getRoles(start = 0, limit = 30) {
    const url = `${BASE_URL}/roles?startIndex=${start}&maxItems=${limit}`;
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


  deleteUserRole(userId, roleId) {
    const url = `${BASE_URL}/accounts/${userId}/roles/${roleId}`;
    return this.doDel(url);
  }

  getUser(accountId) {
    const url = `${BASE_URL}/accounts/${accountId}`;
    return this.doGet(url).account;
  }
}

HmisApiRegistry.addApi('user-service', UserServiceApi);
