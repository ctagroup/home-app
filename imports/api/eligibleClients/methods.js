import { eachLimit } from 'async';
import { logger } from '/imports/utils/logger';
import { HmisClient } from '../hmisApi';

Meteor.methods({
  getEligibleClients() {
    logger.info(`METHOD[${Meteor.userId()}]: getEligibleClients()`);
    if (!Meteor.userId()) {
      throw new Meteor.Error(401, 'Unauthorized');
    }

    const hc = HmisClient.create(Meteor.userId());
    return hc.api('house-matching').getEligibleClients();
  },

  ignoreMatchProcess(inputClientId, ignoreMatchProcess, remarks = '') {
    logger.info(`METHOD[${Meteor.userId()}]: ignoreMatchProcess(${inputClientId}, ${ignoreMatchProcess})`); // eslint-disable-line max-len
    check(inputClientId, Match.OneOf(String, [String])); // eslint-disable-line new-cap
    check(ignoreMatchProcess, Boolean);
    check(remarks, String);

    let eligibleClientOutput;
    if (Meteor.userId()) {
      const hc = HmisClient.create(Meteor.userId());

      let clientIds = inputClientId;
      if (!Array.isArray(inputClientId)) clientIds = [inputClientId];
      eachLimit(clientIds, Meteor.settings.connectionLimit,
        ({ clientId }, callback) => {
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
    } else {
      throw new Meteor.Error('403', 'You are not authorized to perform this action');
    }
    return eligibleClientOutput;
  },

  postHousingMatchScores() {
    logger.info(`METHOD[${Meteor.userId()}]: postHousingMatchScores()`);
    const hc = HmisClient.create(Meteor.userId());
    return hc.api('house-matching').postHousingMatchScores();
  },
});
