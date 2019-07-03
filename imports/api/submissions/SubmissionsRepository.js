class SubmissionsRepository {
  constructor({ hmisClient }) {
    this.hc = hmisClient;
  }

  getSurveySubmissionsPage(pageNumber, pageSize) {
    const result = this.hc.api('survey').getSurveySubmissionsPage(pageNumber, pageSize);
    const items = result.clientSurveySubmissions.slice(0, pageSize).map(x => ({
      ...x,
      client: _.omit({
        ...x.client,
        clientId: x.id,
        schema: x.clientLink.split('/')[3],
      }, ['id']),
    }));
    return {
      items,
      pagination: result.pagination,
    };
  }
}

export default SubmissionsRepository;
