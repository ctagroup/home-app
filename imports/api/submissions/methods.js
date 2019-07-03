Meteor.injectedMethods({
  'submissions.getPage'(pageNumber = 0, pageSize = 50) {
    const { logger, submissionsRepository } = this.context;

    logger.info('submissions.getPage', pageNumber, pageSize);

    const result = submissionsRepository.getSurveySubmissionsPage(pageNumber, pageSize);
    const { items, pagination } = result;
    return {
      content: items,
      page: {
        totalPages: Math.ceil(pagination.total / pageSize),
      },
    };
  },
});
