Meteor.injectedMethods({
  'diExample.searchClient'(query) {
    const { hmisClient, logger } = this.context;
    const results = hmisClient.api('client').searchClient(query);
    logger.debug('got results', results);
    return results;
  },
  'diExample.testError'() {
    const { sentryScope, logger } = this.context;
    sentryScope.addBreadcrumb({ message: 'this is a sample message' });
    logger.debug('this is debug');
    logger.info('this is info', Object.keys(this.context));
    logger.warn('this is warn');
    logger.error('this is error');
    throw new Error('Failing on purpose');
  },
});
