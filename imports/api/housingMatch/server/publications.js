import { eachLimit } from 'async';
import moment from 'moment';
import { HmisClient } from '/imports/api/hmisApi';
import { HmisCache } from '/imports/api/cache/hmisCache';
import { logger } from '/imports/utils/logger';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Meteor.publish(
  'housingMatch.list', function publishHousingMatch() {
    logger.info(`PUB[${this.userId}]: housingMatch.list`);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      return [];
    }

    let stopFunction = false;
    this.onStop(() => {
      stopFunction = true;
    });

    try {
      const hc = HmisClient.create(this.userId);
      const housingMatches = hc.api('house-matching').getHousingMatches();

      // populate the list without the details
      for (let i = 0; i < housingMatches.length && !stopFunction; i += 1) {
        const eligibleClients = housingMatches[i].eligibleClients;
        eligibleClients.clientDetails = { loading: true };
        eligibleClients.referralStatus = { loading: true };
        this.added('localHousingMatch', housingMatches[i].reservationId, housingMatches[i]);
      }
      this.ready();

      const queue = [];
      for (let i = 0; i < housingMatches.length && !stopFunction; i += 1) {
        let schema = 'v2015';
        if (housingMatches[i].links[1].href.indexOf('v2014') !== -1) {
          schema = 'v2014';
        }
        queue.push({
          i,
          clientId: housingMatches[i].eligibleClients.clientId,
          schema,
        });
      }

      eachLimit(queue, Meteor.settings.connectionLimit, (data, callback) => {
        if (stopFunction) {
          callback();
          return;
        }
        Meteor.defer(() => {
          const { i, clientId, schema } = data;
          const eligibleClients = housingMatches[i].eligibleClients;
          // fetch client details
          try {
            const details = HmisCache.getClient(clientId, schema, this.userId);
            eligibleClients.clientDetails = details;
            eligibleClients.clientDetails.schema = schema;
          } catch (e) {
            eligibleClients.clientDetails = { error: e.reason };
          }

          // fetch status history
          try {
            const history = hc.api('house-matching').getReferralStatusHistory(clientId);
            history.sort((a, b) => {
              const aTime = moment(a.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
              const bTime = moment(b.dateUpdated, 'MM-DD-YYYY HH:mm:ss.SSS').unix();
              return aTime - bTime;
            });
            eligibleClients.referralStatus = history;
          } catch (e) {
            eligibleClients.referralStatus = { error: e.reason };
          }
          this.changed('localHousingMatch', housingMatches[i].reservationId, { eligibleClients });
          callback();
        });
      });
    } catch (err) {
      logger.error('eligibleClients.list', err);
    }
    return this.ready();
  }
);
