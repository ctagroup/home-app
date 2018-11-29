import '/imports/startup/server/diContainer';


Meteor.injectedMethods({
  'diExample.searchClient'(query) {
    const { hmisClient, logger } = this.context;
    const results = hmisClient.api('client').searchClient(query);
    logger.debug('got results', results);
    return results;
  },
});
