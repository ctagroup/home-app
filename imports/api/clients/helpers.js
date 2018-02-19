import { removeEmpty } from '/imports/api/utils';

export const mergeByDedupId = (hmisClients) => {
  const groupedHMISClients = _.groupBy(hmisClients, 'dedupClientId');
  return _.map(_.values(groupedHMISClients), (clientSchemas) => {
    let sortedClientSchemas = _.sortBy(clientSchemas, 'schema');
    sortedClientSchemas = _.map(sortedClientSchemas, (client) => removeEmpty(client));
    return Object.assign({}, ...sortedClientSchemas);
  });
};
