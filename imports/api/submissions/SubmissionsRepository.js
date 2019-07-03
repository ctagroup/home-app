class SubmissionsRepository {
  constructor({ hmisClient }) {
    this.hc = hmisClient;
  }

  clientSurveySubmissionsToItems(clientSurveySubmissions) {
    // ACL: change client.id to client.clientId, add client.schema
    const items = clientSurveySubmissions.map(x => ({
      ...x,
      client: _.omit({
        ...x.client,
        clientId: x.id,
        schema: x.clientLink.split('/')[3],
      }, ['id']),
    }));
    return items;
  }

  getSurveySubmissionsPageForClient(dedupClientId, pageNumber, pageSize, sort) {
    const query = {
      q: dedupClientId,
      startIndex: pageNumber * pageSize,
      limit: pageSize,
      sort: sort && sort.by,
      order: sort && sort.order,
    };
    const { clientSurveySubmissions, pagination } = this.hc.api('survey')
      .getSurveySubmissionsPage(query);
    return {
      items: this.clientSurveySubmissionsToItems(clientSurveySubmissions.slice(0, pageSize)),
      pagination,
    };
  }

  getSurveySubmissionsPage(pageNumber, pageSize, sort) {
    const query = {
      startIndex: pageNumber * pageSize,
      limit: pageSize,
      sort: sort && sort.by,
      order: sort && sort.order,
    };
    const { clientSurveySubmissions, pagination } = this.hc.api('survey')
      .getSurveySubmissionsPage(query);
    return {
      items: this.clientSurveySubmissionsToItems(clientSurveySubmissions.slice(0, pageSize)),
      pagination,
    };
  }
}

export default SubmissionsRepository;
