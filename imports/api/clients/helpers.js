import { removeEmpty } from '/imports/api/utils';
export const mergeClient = (clientVersions) => {
  let sortedClientSchemas = _.map(clientVersions, (version) => {
    // assuming that link format is: '/hmis-clientapi/rest/{schema}/clients/{clientId}'
    const linkSchema = version.link.substring(21, 26);
    return Object.assign(removeEmpty(version), {
      schema: version.schema ? version.schema : linkSchema,
    });
  });
  sortedClientSchemas = _.sortBy(sortedClientSchemas, 'schema');
  return Object.assign({}, ...sortedClientSchemas);
};

export const mergeByDedupId = (hmisClients) => {
  const groupedHMISClients = _.groupBy(hmisClients, 'dedupClientId');
  return _.map(_.values(groupedHMISClients), (clientSchemas) => {
    let sortedClientSchemas = _.sortBy(clientSchemas, 'schema');
    sortedClientSchemas = _.map(sortedClientSchemas, (client) => removeEmpty(client));
    return Object.assign({}, ...sortedClientSchemas);
  });
};
