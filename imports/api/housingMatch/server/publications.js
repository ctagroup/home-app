import moment from 'moment';
import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';

Meteor.publish(
  'housingMatch.list', function publishHousingMatch() {
    let stopFunction = false;

    this.onStop(() => {
      stopFunction = true;
    });

    if (!this.userId) {
      return;
    }

    try {
      const hc = HmisClient.create(this.userId);
      const housingMatch = hc.api('house-matching').getHousingMatch();

      // populate the list without the details
      for (let i = 0; i < housingMatch.length && !stopFunction; i += 1) {
        const eligibleClients = housingMatch[i].eligibleClients;
        eligibleClients.clientDetails = { loading: true };
        eligibleClients.referralStatus = { loading: true };
        this.added('localHousingMatch', housingMatch[i].reservationId, housingMatch[i]);
      }
      this.ready();

      // load client details and history
      for (let i = 0; i < housingMatch.length && !stopFunction; i += 1) {
        Meteor.defer(() => {
          const eligibleClients = housingMatch[i].eligibleClients;
          let schema = 'v2015';
          if (housingMatch[i].links[1].href.indexOf('v2014') !== -1) {
            schema = 'v2014';
          }

          const clientId = eligibleClients.clientId;
          // fetch client details
          try {
            const details = hc.api('client').getClient(clientId, schema);
            eligibleClients.clientDetails = details;
          } catch (e) {
            eligibleClients.error = e.reason;
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
          this.changed('localHousingMatch', housingMatch[i].reservationId, {
            eligibleClients,
          });
        });
      }
    } catch (err) {
      logger.error('housingMatch.list', err);
    }
  }
);
