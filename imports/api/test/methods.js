import '/imports/startup/server/diContainer';
// import { logger } from '/imports/utils/logger';


Meteor.injectedMethods({
  'diExample.searchClient'(query, { hmisClient }) {
    const results = hmisClient.api('client').searchClient(query);
    return results;
  },
});
