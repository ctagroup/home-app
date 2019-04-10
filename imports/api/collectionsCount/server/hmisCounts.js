import { HmisClient } from '/imports/api/hmisApi';
import { ALL_CLIENT_SCHEMAS } from '/imports/api/hmisApi/clientApi';


class HmisCounts {
  constructor(userId) {
    this.userId = userId;
  }

  getClientsCount() {
    const hc = HmisClient.create(this.userId);
    return ALL_CLIENT_SCHEMAS.reduce(
      (count, schema) => count + hc.api('client').getNumberOfClients(schema),
      0
    );
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

  getQuestionsCount() {
    const hc = HmisClient.create(this.userId);
    const groups = hc.api('survey').getQuestionGroups();

    return groups.reduce((prev, group) => {
      const count = hc.api('survey2').getQuestionsCount(group.questionGroupId, 0, 0);
      return prev + count;
    }, 0);
  }
}

export default HmisCounts;
