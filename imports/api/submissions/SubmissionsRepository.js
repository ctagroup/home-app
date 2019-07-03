class SubmissionsRepository {
  constructor({ hmisClient }) {
    this.hc = hmisClient;
  }

  getSurveySubmissionsPage(pageNumber, pageSize, sort) {
    const result = this.hc.api('survey').getSurveySubmissionsPage(pageNumber, pageSize, sort);
    // ACL:
    // change client.id to client.clientId
    // add client.schema
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
