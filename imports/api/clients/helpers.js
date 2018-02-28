import { removeEmpty } from '/imports/api/utils';

const getVersions = (schemas) => _.map(schemas,
  (version) => ({ schema: version.schema, clientId: version.clientId }));

export const mergeClient = (clientVersionsList) => {
  let sortedClientSchemas = _.map(clientVersionsList, (version) => {
    // assuming that link format is: '/hmis-clientapi/rest/{schema}/clients/{clientId}'
    const linkSchema = version.link.substring(21, 26);
    return Object.assign(removeEmpty(version), {
      schema: version.schema ? version.schema : linkSchema,
    });
  });
  sortedClientSchemas = _.sortBy(sortedClientSchemas, 'schema');
  const clientVersions = getVersions(sortedClientSchemas);
  return Object.assign({ clientVersions }, ...sortedClientSchemas);
};

export const mergeByDedupId = (hmisClients) => {
  const groupedHMISClients = _.groupBy(hmisClients, 'dedupClientId');
  return _.map(_.values(groupedHMISClients), (clientSchemas) => {
    let sortedClientSchemas = _.sortBy(clientSchemas, 'schema');
    sortedClientSchemas = _.map(sortedClientSchemas, (client) => removeEmpty(client));
    const clientVersions = getVersions(sortedClientSchemas);
    return Object.assign({ clientVersions }, ...sortedClientSchemas);
  });
};
