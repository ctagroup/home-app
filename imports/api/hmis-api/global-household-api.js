import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

const BASE_URL = 'https://www.hmislynk.com/global-household-api';

class GlobalHouseHoldApi extends ApiEndpoint {
  createGlobalHousehold(householdMembers, householdObject) {
    const url = `${BASE_URL}/global-households`;
    const body = {
      globalHouseholds: [
        householdObject,
      ],
    };
    const household = this.doPost(url, body)[0];
    this.addMembersToHousehold(household.globalHouseholdId, householdMembers);
    return household;
  }

  updateGlobalHousehold(householdId, householdObject) {
    const url = `${BASE_URL}/global-households/${householdId}`;
    const body = householdObject;
    return this.doPut(url, body);
  }

  deleteGlobalHousehold(householdId) {
    const url = `${BASE_URL}/global-households/${householdId}`;
    return this.doDel(url);
  }

  addMembersToHousehold(householdId, householdMembers) {
    const url = `${BASE_URL}/global-households/${householdId}/members`;
    const body = {
      members: householdMembers,
    };
    return this.doPost(url, body);
  }

  updateMembersOfHousehold(householdId, householdMembers) {
    // WARNING: will update existing members only,
    // will not replace current members with householdMembers
    const url = `${BASE_URL}/global-households/${householdId}/members`;
    const body = { members: householdMembers };
    return this.doPut(url, body);
  }

  deleteMemberFromHousehold(householdId, membershipId) {
    const url = `${BASE_URL}/global-households/${householdId}/members/${membershipId}`;
    return this.doDel(url);
  }

  getHouseholds(page = 0, limit = 30) {
    const url = `${BASE_URL}/global-households?page=${page}&limit=${limit}`;
    const response = this.doGet(url);
    let globalHouseholds = response.content;
    if (response.page.number < response.page.totalPages - 1) {
      globalHouseholds = _.union(
        globalHouseholds,
        this.getHouseholds(response.page.number + 1, response.page.size)
      );
    }
    return globalHouseholds;
  }

  getHousehold(householdId) {
    const url = `${BASE_URL}/global-households/${householdId}`;
    return this.doGet(url);
  }

  getHouseholdMembers(householdId, page = 0, size = 9999) {
    const url = `${BASE_URL}/global-households/${householdId}/members?page=${page}&size=${size}`;
    const response = this.doGet(url);
    let householdMembers = response.content;
    if (response.page.number < response.page.totalPages - 1) {
      householdMembers = _.union(
        householdMembers,
        this.getHouseholdMembers(householdId, response.page.number + 1, response.page.size)
      );
    }
    return householdMembers;
  }

  getGlobalHouseholdMemberships(clientId, page = 0, limit = 9999) {
    const url = `${BASE_URL}/members?clientid=${clientId}&page=${page}&size=${limit}`; // eslint-disable-line max-len
    return this.doGet(url);
  }

}

HmisApiRegistry.addApi('global-household', GlobalHouseHoldApi);
