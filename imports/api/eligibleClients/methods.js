import { eachLimit } from 'async';
import { logger } from '/imports/utils/logger';
import { ClientsAccessRoles } from '/imports/config/permissions';
import { HmisClient } from '../hmisApi';

Meteor.methods({
  getEligibleClients() {
    logger.info(`METHOD[${this.userId}]: getEligibleClients()`);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching').getEligibleClients();
  },
  getEligibleClientsPage(pageNumber = 0, pageSize = 50, sort = 'firstName', order = 'desc') {
    logger.info(`METHOD[${this.userId}]: getEligibleClientsPage(${pageNumber}, ${pageSize}, ${sort}, ${order})`); // eslint-disable-line max-len
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching-v2').getEligibleClientsPage(pageNumber, pageSize, sort, order);
  },

  ignoreMatchProcess(inputClientId, ignoreMatchProcess, remarks = '') {
    logger.info(`METHOD[${this.userId}]: ignoreMatchProcess(${Array.isArray(inputClientId)}, ${inputClientId}, ${ignoreMatchProcess})`); // eslint-disable-line max-len

    check(inputClientId, Match.OneOf(String, [String])); // eslint-disable-line new-cap
    check(ignoreMatchProcess, Boolean);
    check(remarks, String);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    let eligibleClientOutput;
    const hc = HmisClient.create(this.userId);

    const clientIds = Array.isArray(inputClientId) ? inputClientId : [inputClientId];
    eachLimit(clientIds, Meteor.settings.connectionLimit,
      (clientId, callback) => {
        Meteor.defer(() => {
          // fetch client status
          try {
            // get client details
            const eligibleClient = hc.api('house-matching').getEligibleClient(clientId);

            // update the client status
            eligibleClient.ignoreMatchProcess = ignoreMatchProcess;
            eligibleClient.remarks = remarks;
            delete eligibleClient.links;
            hc.api('house-matching').updateEligibleClient(eligibleClient);

            // return updated eligible client object to the client
            eligibleClientOutput = eligibleClient;
          } catch (e) {
            logger.warn(e);
          }
          callback();
        });
      });

    return eligibleClientOutput;
  },

  postHousingMatchScores() {
    logger.info(`METHOD[${this.userId}]: postHousingMatchScores()`);
    if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    const hc = HmisClient.create(this.userId);
    return hc.api('house-matching').postHousingMatchScores();
  },
});
