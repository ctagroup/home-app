import { mapLimit } from 'async';
import {
  sortByTime,
  mergeClientExtended,
  getEligibleClient,
  getClientEnrollments,
  getGlobalHouseholds,
  getReferralStatusHistory,
  getHousingMatch,
  filterClientForCache,
} from '/imports/api/clients/helpers';
import { rejects } from 'assert';


function theirClientVersionToOurClientVersion(theirClientVersion) {
  const ourClientVersion = {
    ...theirClientVersion,
    schema: theirClientVersion.link.split('/')[3],
  };
  return ourClientVersion;
}

function mergeObjects(objectVersions) {
  return objectVersions.reduce((mergedSoFar, version) => ({
    ...mergedSoFar,
    ...version,
  }), {});
}

function mergeClientVersions(sortedClientVersions) {
  const merged = mergeObjects(sortedClientVersions);

  const enrollments = null;

  return {
    clientVersions: sortedClientVersions,
    ...merged,
    enrollments,
  };
}


class ClientsRepository {
  constructor({ hmisClient, auditLog, logger, meteorSettings }) {
    this.hc = hmisClient;
    this.logger = logger;
    this.settings = meteorSettings;
    this.auditLog = auditLog;
  }

  getClientByIdAndSchema(clientId, schema) {
    const client = this.hc.api('client').getClient(clientId, schema);
    let clientVersions = [client];
    if (client.dedupClientId) {
      clientVersions = this.hc.api('client')
        .searchClient(client.dedupClientId)
        .map(theirClientVersionToOurClientVersion);
    }
    const sortedClientVersions = _.sortBy(clientVersions, 'schema');
    const mergedClient = mergeClientVersions(sortedClientVersions);
    return mergedClient;
  }

  getClientByDedupId(dedupClientId) {
    const clientVersions = this.hc.api('client').searchClient(dedupClientId);
    const sortedClientVersions = _.sortBy(clientVersions, 'schema');
    const mergedClient = mergeClientVersions(sortedClientVersions);
    return mergedClient;
  }

  async getEligibleClientByDedupIdAsync(dedupClientId) {
    // return merged data for eligible client
    const mergedClient = this.getClientByDedupId(dedupClientId);
    const clientIds = mergedClient.clientVersions.map(v => v.clientId);
    return await this.getEligibleClientByClientVersionsAsync(clientIds);
  }

  async getEligibleClientByClientVersionsAsync(clientIds) {
    // returns a eligible client data merged from eligible clients for specified clientIds
    const eligibleClientVersions = await this.getElibibleClientVersionsAsync(clientIds);
    const mergedEligibleClient = mergeObjects(eligibleClientVersions.filter(v => !v.error));
    return mergedEligibleClient;
  }

  async getElibibleClientVersionsAsync(clientIds) {
    // returns eligible client data for given clientIds
    const limit = this.settings.connectionLimit;

    const iteratee = (clientId, callback) => {
      Meteor.defer(() => {
        const eligibleClient = getEligibleClient(this.hc, clientId);
        const schema = eligibleClient.links &&
          eligibleClient.links.find(l => l.rel === 'client').href.split('/')[3];
        callback(null, {
          ...eligibleClient,
          clientId,
          schema,
        });
      });
    };

    return new Promise((resolve, reject) => {
      mapLimit(clientIds, limit, iteratee, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  getHouseholdsForVersions(clientVersions) {
    return clientVersions.map(version => {
      const { clientId, schema } = version;
      const versionEnrollments = this.hc.api('client').getClientEnrollments(clientId, schema);
      return {
        ...version,
        households: versionEnrollments,
      };
    });
  }

  getReferralStatusHistoryForVersions(clientVersions) {
    return clientVersions.map(version => {
      const { clientId, schema } = version;
      const versionEnrollments = this.hc.api('client').getClientEnrollments(clientId, schema);
      return {
        ...version,
        referralStatusHistory: versionEnrollments,
      };
    });
  }

  getHousingMatchForVersions(clientVersions) {
    return clientVersions.map(version => {
      const { clientId, schema } = version;
      const versionEnrollments = this.hc.api('client').getClientEnrollments(clientId, schema);
      return {
        ...version,
        housingMatch: versionEnrollments,
      };
    });
  }

  getMatchingScoreForVersions(clientVersions) {
    return clientVersions.map(version => {
      const { clientId, schema } = version;
      const versionEnrollments = this.hc.api('client').getClientEnrollments(clientId, schema);
      return {
        ...version,
        matchingScore: versionEnrollments,
      };
    });
  }


  // write operations
  async addToActiveListAsync(dedupClientId) {
    const dedupClient = this.getClientByDedupId(dedupClientId);
    const clientIds = dedupClient.clientVersions.map(v => v.clientId);
    const eligibleClientVersions = await this.getElibibleClientVersionsAsync(clientIds);

    const results = eligibleClientVersions
      .filter(v => !v.error)
      .map(version => {
      // update the client status
        const updatedVersion = _.omit({
          ...version,
          ignoreMatchProcess: false,
        }, ['links']);
        return this.hc.api('house-matching').updateEligibleClient(updatedVersion);
      });
    this.auditLog.addMessage(`Client ${dedupClientId} added to active list`);
    this.logger.debug(results);
  }

  async removeFromActiveList(dedupClientId, remarks) {
    const dedupClient = this.getClientByDedupId(dedupClientId);
    const clientIds = dedupClient.clientVersions.map(v => v.clientId);
    const eligibleClientVersions = await this.getElibibleClientVersionsAsync(clientIds);

    const result = eligibleClientVersions.map(eligibleClient => {
      console.log(eligibleClient);
    });
  }
}

export default ClientsRepository;
