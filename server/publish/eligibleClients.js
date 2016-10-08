/**
 * Created by Mj on 10/6/2016.
 */

Meteor.publish(
  'eligibleClients', function publishEligibleClients() {
    const self = this;
    let eligibleClients = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      const response = HMISAPI.getEligibleClientsForPublish();
      eligibleClients = response.content;
      // according to the content received.
      logger.info(`Eligible Clients: ${eligibleClients.length}`);
      // Ideally all should be returned here. Keeping it commented for now.
      // for (let i = 1; i < response.page.totalPages; i += 1) {
      //   const temp = HMISAPI.getEligibleClientsForPublish(i);
      //   eligibleClients.push(...temp.content);
      //   logger.info(`Temp: ${eligibleClients.length}`);
      // }
      // TODO add self.added here.
      self.ready();
    } else {
      HMISAPI.setCurrentUserId('');
    }
  }
);
