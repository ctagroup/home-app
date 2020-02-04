import { getClientTagsSummary } from '/imports/api/tags/tags';

class BonusScoreCalculator {
  constructor({ dedupClientId, tagApi }) {
    this.dedupClientId = dedupClientId;
    this.tagApi = tagApi;
  }

  getFamScore() {
    // TODO: to be implemented
    return 0;
  }

  getVetScore() {
    // TODO: to be implemented
    return 0;
  }

  getTagScore() {
    const clientTags = this.tagApi.getTagsForClient(this.dedupClientId);
    const clientTagSummary = getClientTagsSummary(clientTags);

    const uniqueTagsMapping = {
      'Medically Frail': 'uniqueGroup1',
      'MC-WPC': 'uniqueGroup1',
      'SBC-WPC': 'uniqueGroup1',
    };

    /* [{ operation: 0, tag: { id: 4, name: 'CARS', score: 0 }, ...] */
    const scoreSummary = clientTagSummary
      .filter(x => x.operation)
      .map(x => x.tag) /* tag: { id: 4, name: 'CARS', score: 0 } */
      .reduce((scoreDict, { name, score }) => {
        const key = uniqueTagsMapping[name] || name;
        return {
          ...scoreDict,
          [key]: score,
        };
      }, {});

    const totalTagScore = Object.values(scoreSummary).reduce((total, s) => total + s, 0);
    return Math.min(totalTagScore, 3);
  }

  getBonusScoreDetails() {
    const famScore = this.getFamScore();
    const vetScore = this.getVetScore();
    const tagScore = this.getTagScore();

    return {
      famScore,
      vetScore,
      tagScore,
      total: famScore + vetScore + tagScore,
    };
  }
}

export default BonusScoreCalculator;
