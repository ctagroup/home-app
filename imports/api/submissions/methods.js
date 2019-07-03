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
});
