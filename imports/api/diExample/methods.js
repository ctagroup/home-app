Meteor.injectedMethods({
  'diExample.searchClient'(query) {
    const { hmisClient, logger } = this.context;
    const results = hmisClient.api('client').searchClient(query);
    logger.debug('got results', results);
    return results;
  },
  'diExample.test'(...args) {
    // logger.debug('got args', args);
    const { sentryScope, logger } = this.context;
    sentryScope.addBreadcrumb({ message: 'this is a sample message' });
    console.log('aaa', Object.keys(this.context), this.context.endpointName);
    throw new Error('abcd');
    return [args, logger];
  },

});
