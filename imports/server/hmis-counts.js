import { HmisClient } from '/imports/api/hmis-api';

export class HmisCounts {
  constructor(userId) {
    this.userId = userId;
  }

  getEligibleClientsCount() {
    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching').getEligibleClients().length;
  }

  getHousingMatchCount() {
    // TODO: use new api
    const self = this;
    let count;
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getHousingMatchForPublish();
      if (!response) {
        count = 0;
      } else {
        count = response.length;
      }
    }
    return count;
  }

  getHousingUnitsCount() {
    // TODO: use new api
    const self = this;
    let count = 0;
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getHousingUnitsForPublish();
      count = response.page.totalElements;
    } else {
      HMISAPI.setCurrentUserId('');
    }
    return count;
  }

  getGlobalHouseholdsCount() {
    const hc = HmisClient.create(this.userId);
    return hc.api('global-household').getHouseholds().length;
  }
}
