import { getClientSchemaFromLinks } from '/imports/api/utils';
import { ClientsAccessRoles } from '/imports/config/permissions';
import { HmisClient } from '/imports/api/hmisApi';
import { logger } from '/imports/utils/logger';

Meteor.publish('eligibleClients.list', function publishEligibleClients() {
  logger.info(`PUB[${this.userId}]: eligibleClients.list()`);
  if (!Roles.userIsInRole(this.userId, ClientsAccessRoles)) {
    return [];
  }

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
    const eligibleClients = hc.api('house-matching-v2').getEligibleClients();

    // populate the list without the details
    for (let i = 0; i < eligibleClients.length && !stopFunction; i += 1) {
      const schema = getClientSchemaFromLinks(eligibleClients[i].links, 'v2015');
      Object.assign(eligibleClients[i].client, { schema });
      self.added('localEligibleClients', eligibleClients[i].clientId, eligibleClients[i]);
    }
    self.ready();
  } catch (err) {
    logger.error('eligibleClients.list', err);
  }
  return self.ready();
});

Meteor.publish('eligibleClients.page', function publishEligibleClientsPage(
  pageNumber = 0, pageSize = 50, sort = 'firstName', order = 'desc') {
  logger.info(
    `PUB[${this.userId}]: eligibleClients.page(${pageNumber}, ${pageSize}, ${sort}, ${order})`);
  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => { stopFunction = true; });

  if (!this.userId) return self.ready();

  try {
    const hc = HmisClient.create(this.userId);
    const eligibleClients =
      hc.api('house-matching-v2').getEligibleClientsPage(pageNumber, pageSize, sort, order);

    // populate the list without the details
    for (let i = 0; i < eligibleClients.length && !stopFunction; i += 1) {
      const schema = getClientSchemaFromLinks(eligibleClients[i].links, 'v2015');
      Object.assign(eligibleClients[i].client, { schema });
      self.added('localEligibleClients', eligibleClients[i].clientId, eligibleClients[i]);
    }
    self.ready();
  } catch (err) {
    logger.error('eligibleClients.list', err);
  }
  return self.ready();
});
