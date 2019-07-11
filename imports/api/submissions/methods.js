Meteor.injectedMethods({
  'submissions.getPage'(dedupClientId, pageNumber = 0, pageSize = 50, sort = null) {
    const { logger, submissionsRepository } = this.context;
    logger.info('submissions.getPage', dedupClientId, pageNumber, pageSize, sort);

    check(dedupClientId, Match.OneOf(String, null)); // eslint-disable-line new-cap
    check(pageNumber, Number);
    check(pageSize, Number);

    const result = dedupClientId ?
      submissionsRepository.getSurveySubmissionsPageForClient(
        dedupClientId, pageNumber, pageSize, sort)
      :
      submissionsRepository.getSurveySubmissionsPage(
        pageNumber, pageSize, sort);
    const { items, pagination } = result;
    return {
      content: items,
      page: {
        totalPages: Math.ceil(pagination.total / pageSize),
      },
    };
  },
  'submissions.view'(clientId, surveyId, submissionId) {
    const {
      clientsRepository,
      logger,
      submissionsService,
      submissionsRepository,
      surveysRepository,
    } = this.context;
    logger.info('submissions.view', clientId, surveyId, submissionId);

    check(clientId, String);
    check(surveyId, String);
    check(submissionId, String);

    const client = clientsRepository.findClientById(clientId);
    const survey = surveysRepository.getSurvey(surveyId);

    console.log(client);

    const submissionResponses = submissionsRepository
      .getSubmissionResponses(clientId, surveyId, submissionId);

    const { valid, invalid } = submissionsService
      .importSubmissionAsResponse(submissionResponses, survey);

    // simulate Mongo response
    const mongoResponse = {
      clientId,
      clientSchema: client.schema,
      status: 'completed',
      surveyId,
      surveyorId: null,
      version: 2,
      createdAt: null,
      updatedAt: null,
      submittedAt: null,
      values: valid.reduce((all, r) => ({ ...all, [r.itemId]: r.value }), {}),
    };

    return {
      invalidResponses: invalid,
      response: mongoResponse,
      survey,
      client,
    };
  },
  'submissions.delete'(clientId, surveyId, submissionId) {
    const { logger, submissionsRepository } = this.context;
    logger.info('submissions.delete', submissionId);

    check(clientId, String);
    check(surveyId, String);
    check(submissionId, String);
    submissionsRepository.deleteSubmission(clientId, surveyId, submissionId);
  },
});
