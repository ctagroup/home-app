/**
 * Created by Mj on 10/6/2016.
 */

Meteor.publish(
  'eligibleClients', function publishEligibleClients() {
    const self = this;
    let eligibleClients = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      eligibleClients = HMISAPI.getEligibleClientsForPublish();
      // according to the content received.
      // Ideally all should be returned here. Keeping it commented for now.
      // for (let i = 1; i < response.page.totalPages; i += 1) {
      //   const temp = HMISAPI.getEligibleClientsForPublish(i);
      //   eligibleClients.push(...temp.content);
      //   logger.info(`Temp: ${eligibleClients.length}`);
      // }
      if (eligibleClients) {
        logger.info(`Publishing Eligible Clients: ${JSON.stringify(eligibleClients)}`);
        for (let i = 0; i < eligibleClients.length; i += 1) {
          // TODO Add client details (Name & link to profile) here.
          self.added('eligibleClients', eligibleClients[i].clientId, eligibleClients[i]);
        }
      }
      self.ready();
    } else {
      HMISAPI.setCurrentUserId('');
    }
  }
);
