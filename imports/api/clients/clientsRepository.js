import { mergeClientExtended } from '/imports/api/clients/helpers';

class ClientsRepository {
  constructor({ hmisClient }) {
    this.hc = hmisClient;
  }

  // getClient(dedupClientId) {
  //   const clientVersions = this.hc.api('client').searchClient(dedupClientId);
  //   // TODO: merge client versions
  // }

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
}

export default ClientsRepository;
