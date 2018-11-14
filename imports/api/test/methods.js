import '/imports/startup/server/diContainer';
// import { logger } from '/imports/utils/logger';


Meteor.injectedMethods({
  'diExample.searchClient'(query) {
    const { hmisClient, userId, connectionString } = this.context;
    console.log(query, userId, connectionString);
    const results = hmisClient.api('client').searchClient(query);
    return results;
  },
});
