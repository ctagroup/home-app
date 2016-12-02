/**
 * Created by Mj on 10/6/2016.
 */

Meteor.publish(
  'eligibleClients', function publishEligibleClients() {
    const self = this;
    let stopFunction = false;
    self.unblock();

    self.onStop(() => {
      stopFunction = true;
    });

    let eligibleClients = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      eligibleClients = HMISAPI.getEligibleClientsForPublish();
      // according to the content received.
      if (eligibleClients) {
        for (let i = 0; i < eligibleClients.length && !stopFunction; i += 1) {
          // Add client details (Name & link to profile) here.
          if (eligibleClients[i].links && eligibleClients[i].links.length > 0) {
            let schema = 'v2015';
            if (eligibleClients[i].links[0].href.indexOf('v2014') !== -1) {
              schema = 'v2014';
            }
            eligibleClients[i].clientDetails = HMISAPI.getClient(
              eligibleClients[i].clientId,
              schema,
              // useCurrentUserObject
              false
            );
            eligibleClients[i].clientDetails.schema = schema;
            logger.info(JSON.stringify(eligibleClients[i].clientDetails));
          }
          // If client Id not found. So that we don't get any error.
          if (!eligibleClients[i].clientDetails) {
            const clientId = '';
            const firstName = '';
            const middleName = '';
            const lastName = '';
            const schema = '';
            eligibleClients[i].clientDetails = {
              clientId,
              firstName,
              middleName,
              lastName,
              schema,
            };
          }
          self.added('eligibleClients', eligibleClients[i].clientId, eligibleClients[i]);
          self.ready();
        }
      }
    } else {
      HMISAPI.setCurrentUserId('');
    }
    return self.ready();
  }
);
