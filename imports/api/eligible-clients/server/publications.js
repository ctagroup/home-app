import { HmisClient } from '/imports/api/hmis-api';
import { logger } from '/imports/utils/logger';

Meteor.publish('eligibleClients', function publishEligibleClients() {
  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => {
    stopFunction = true;
  });

  if (!this.userId) {
    return [];
  }

  try {
    const hc = HmisClient.create(this.userId);
    let eligibleClients = hc.api('house-matching').getEligibleClients();

    // filter by ignoreMatchProcess field
    eligibleClients = _.filter(eligibleClients, (c) => c.ignoreMatchProcess === false);

    // populate the list without the details
    for (let i = 0; i < eligibleClients.length && !stopFunction; i += 1) {
      eligibleClients[i].clientDetails = {
        clientId: '',
        firstName: '',
        middleName: '',
        lastName: '',
        schema: '',
      };
      self.added('localEligibleClients', eligibleClients[i].clientId, eligibleClients[i]);
    }
    self.ready();

    // Add client details (Name & link to profile) here.
    for (let i = 0; i < eligibleClients.length && !stopFunction; i += 1) {
      if (eligibleClients[i].links && eligibleClients[i].links.length > 0) {
        let schema = 'v2015';
        if (eligibleClients[i].links[0].href.indexOf('v2014') !== -1) {
          schema = 'v2014';
        }

        hc.api('client').promiseGetClient(eligibleClients[i].clientId, schema)
          .then((client) => {
            const clientDetails = client;
            clientDetails.schema = schema;
            self.changed('localEligibleClients', eligibleClients[i].clientId, {
              clientDetails,
            });
          })
          .catch((e) => {
            logger.error(e);
          });
      }
    }
  } catch (err) {
    logger.error('publish eligibleClients', err);
  }
  return self.ready();
});
