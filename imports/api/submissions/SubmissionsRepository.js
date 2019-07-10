export default class SubmissionsRepository {
  constructor({ hmisClient, responsesCollection, surveysRepository }) {
    this.hc = hmisClient;
    this.surveysRepository = surveysRepository;
    this.responsesCollection = responsesCollection;
  }

  mergeSubmissionWithMongoResponse(submission, response) {
    if (response.enrollment) {
      return {
        ...submission,
        mongoId: response._id,
        type: 'local enrollment',
        enrollment: response.enrollment,
        submissionDate: response.updatedAt,
      };
    }

    return {
      ...submission,
      mongoId: response._id,
      type: `local survey (v${response.version})`,
      submissionDate: response.updatedAt,
    };
  }

  clientSurveySubmissionsToItem(submission) {
    const { client } = submission;
    const localResponse = this.responsesCollection.findOne({
      submissionId: submission.submissionId,
    });

    let item;
    if (localResponse) {
      item = this.mergeSubmissionWithMongoResponse(submission, localResponse);
    } else {
      item = {
        ...submission,
        type: 'survey',
      };
    }

    const modifiedClient = {
      ...client,
      clientId: client.id,
      schema: submission.clientLink.split('/')[3],
    };

    return {
      ...item,
      client: _.omit(modifiedClient, ['id']),
    };
  }

  clientSurveySubmissionsToItems(clientSurveySubmissions) {
    // ACL: change client.id to client.clientId, add client.schema
    const items = clientSurveySubmissions.map(this.clientSurveySubmissionsToItem.bind(this));
    return items;
  }

  getSubmissionResponses(clientId, surveyId, submissionId) {
    const submissionResponses = this.hc.api('survey')
      .getSubmissionResponses(clientId, surveyId, submissionId);
    return submissionResponses;
  }

  getSurveySubmissionsPageForClient(dedupClientId, pageNumber, pageSize, sort) {
    // gets client submissions using pager
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
    // gets all submissions using pager
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

  deleteSubmission(clientId, surveyId, submissionId) {
    this.hc.api('survey').deleteSubmission(clientId, surveyId, submissionId);
    this.responsesCollection.remove({ submissionId });
  }
}
