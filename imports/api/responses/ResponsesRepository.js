class ResponsesRepository {
  constructor({ hmisClient, logger, responsesCollection, hmisCache, userId }) {
    this.hc = hmisClient;
    this.logger = logger;
    this.responsesCollection = responsesCollection;
    this.hmisCache = hmisCache;
    this.userId = userId;
  }

  getSurveySubmissionsByClientId(clientId) {
    const searchResult = this.hc.api('client').searchClient(clientId);
    if (searchResult.length === 0) {
      return [];
    }
    const { dedupClientId } = searchResult[0];
    const remoteSubmissions = this.getRemoteSurveySubmissions(dedupClientId);
    const clientVersions = this.hc.api('global').getClientVersions(dedupClientId);
    const clientIds = clientVersions.map(client => client.clientId);
    const localSubmissions = this.getMongoResponses(clientIds);
    const mergedSubmissions = [...remoteSubmissions, ...localSubmissions].reduce((all, r) => ({
      ...all,
      [r.submissionId]: r,
    }), {});
    return Object.values(mergedSubmissions);
  }

  getSurveySubmissions(dedupClientId) {
    const remoteSubmissions = this.getRemoteSurveySubmissions(dedupClientId);
    const clientVersions = this.hc.api('global').getClientVersions(dedupClientId);
    const clientIds = clientVersions.map(client => client.clientId);
    const localSubmissions = this.getMongoResponses(clientIds);
    const mergedSubmissions = [...remoteSubmissions, ...localSubmissions].reduce((all, r) => ({
      ...all,
      [r.submissionId]: r,
    }), {});
    return Object.values(mergedSubmissions);
  }

  getRemoteSurveySubmissions(dedupClientId) {
    const remoteSubmissions = this.hc.api('survey').getSurveySubmissions(dedupClientId).map(s => ({
      _id: s.submissionId,
      clientId: s.clientId,
      clientSchema: s.clientLink.split('/')[3],
      status: 'not imported',
      surveyId: s.survey.surveyId,
      surveyorId: null,
      submissionId: s.submissionId,
      values: [],
      createdAt: null,
      updatedAt: null,
      client: s.client,
      survey: s.survey,
    }));
    return remoteSubmissions;
  }

  getMongoResponses(clientIds) {
    return this.responsesCollection
      .find({ clientId: { $in: clientIds } })
      .map(r => ({
        ...r,
        client: this.hmisCache.getClient(r.clientId, r.clientSchema, this.userId),
        survey: this.hmisCache.getSurvey(r.surveyId, this.userId),
      }));
  }
}

export default ResponsesRepository;
