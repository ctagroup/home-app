import { HmisClient } from '/imports/api/hmisApi';

class HmisCounts {
  constructor(userId) {
    this.userId = userId;
  }

  getClientsCount() {
    const hc = HmisClient.create(this.userId);
    const schemas = ['v2017', 'v2016', 'v2015', 'v2014'];
    return schemas.reduce(
      (count, schema) => count + hc.api('client').getClients(schema).length,
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
