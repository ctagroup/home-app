Meteor.injectedMethods({
  'submissions.getPage'(pageNumber = 0, pageSize = 50, sort = null) {
    const { logger, submissionsRepository } = this.context;

    logger.info('submissions.getPage', pageNumber, pageSize, sort, 123);

    const result = submissionsRepository.getSurveySubmissionsPage(pageNumber, pageSize, sort);
    const { items, pagination } = result;
    return {
      content: items,
      page: {
        totalPages: Math.ceil(pagination.total / pageSize),
      },
    };
  },
});
