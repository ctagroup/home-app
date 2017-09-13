import { HmisClient } from '/imports/api/hmis-api';

class HmisCounts {
  constructor(userId) {
    this.userId = userId;
  }

  getEligibleClientsCount() {
    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching').getEligibleClients().length;
  }

  getHousingMatchCount() {
    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching').getHousingMatches().length;
  }

  getHousingUnitsCount() {
    const hc = HmisClient.create(this.userId);
    return hc.api('housing').getHousingUnits().length;
  }

  getGlobalHouseholdsCount() {
    const hc = HmisClient.create(this.userId);
    return hc.api('global-household').getHouseholds().length;
  }
}

export default HmisCounts;
