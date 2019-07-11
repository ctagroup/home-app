import { mergeClientExtended } from '/imports/api/clients/helpers';

class ClientsRepository {
  constructor({ hmisClient }) {
    this.hc = hmisClient;
  }

  getClientByIdAndSchema(clientId, schema) {
    const client = this.hc.api('client').getClient(clientId, schema);
    let clientVersions = [client];
    if (client.dedupClientId) {
      clientVersions = this.hc.api('client').searchClient(client.dedupClientId);
    }
    const mergedClient = mergeClientExtended(
      _.uniq([client].concat(clientVersions), (i) => i.clientId), schema);
    return mergedClient;
  }

  getClientByDedupId(dedupClientId) {
    const clientVersions = this.hc.api('client').searchClient(dedupClientId);
    const mergedClient = mergeClientExtended(
      _.uniq(clientVersions, (i) => i.clientId));
    return mergedClient;
  }

  findClientById(clientId) {
    return this.getClientByDedupId(clientId);
  }
}

export default ClientsRepository;
