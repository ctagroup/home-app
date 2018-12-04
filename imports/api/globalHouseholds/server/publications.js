import { logger } from '/imports/utils/logger';
import { eachLimit } from 'async';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.publish('globalHouseholds.list', function publishHouseholds() {
  logger.info(`PUB[${this.userId}]: globalHouseholds.list`);
  if (!this.userId) {
    return [];
  }

  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);
  const globalHouseholds = hc.api('global-household').getHouseholds();

  // send initial data
  for (let i = 0; i < globalHouseholds.length && !stopFunction; i += 1) {
    const household = globalHouseholds[i];
    household.headOfHouseholdClient = { loading: true };
    household.userDetails = household.userId ? { loading: true } : {};
    household.schema = 'v2015';
    if (household.links[0].rel.indexOf('v2014') !== -1) {
      household.schema = 'v2014';
    }
    self.added('localGlobalHouseholds', household.genericHouseholdId, household);
  }
  self.ready();

  const clientsQueue = [];
  const usersQueue = [];
  for (let i = 0; i < globalHouseholds.length && !stopFunction; i += 1) {
    const household = globalHouseholds[i];
    clientsQueue.push({
      genericHouseholdId: household.genericHouseholdId,
      clientId: household.headOfHouseholdId,
      schema: household.schema,
    });
    if (household.userId) {
      usersQueue.push({
        genericHouseholdId: household.genericHouseholdId,
        userId: household.userId,
      });
    }
  }

  eachLimit(clientsQueue, Meteor.settings.connectionLimit, (data, callback) => {
    if (stopFunction) {
      callback();
      return;
    }
    const { genericHouseholdId, clientId, schema } = data;
    let clientDetails;
    Meteor.defer(() => {
      try {
        clientDetails = hc.api('client').getClient(clientId, schema);
        clientDetails.schema = schema;
      } catch (e) {
        clientDetails = { error: e.reason };
      }
      self.changed('localGlobalHouseholds', genericHouseholdId, {
        headOfHouseholdClient: clientDetails,
      });
      callback();
    });
  });

  eachLimit(usersQueue, Meteor.settings.connectionLimit, (data, callback) => {
    if (stopFunction) {
      callback();
      return;
    }
    const { genericHouseholdId, userId } = data;
    let userDetails;
    Meteor.defer(() => {
      try {
        userDetails = hc.api('user-service').getUser(userId);
      } catch (e) {
        userDetails = { error: e.reason };
      }
      self.changed('localGlobalHouseholds', genericHouseholdId, {
        userDetails,
      });
      callback();
    });
  });

  return self.ready();
});


Meteor.publish('globalHouseholds.one', function publishHousehold(genericHouseholdId) {
  logger.info(`PUB[${this.userId}]: globalHouseholds.one`, genericHouseholdId);
  if (!this.userId) {
    return [];
  }

  const self = this;
  let stopFunction = false;
  self.unblock();

  self.onStop(() => {
    stopFunction = true;
  });

  const hc = HmisClient.create(this.userId);
  const household = hc.api('global-household').getHousehold(genericHouseholdId);
  household.clients = hc.api('global-household').getHouseholdMembers(genericHouseholdId);

  for (let i = 0; i < household.clients.length && !stopFunction; i += 1) {
    const client = household.clients[i];
    let schema = 'v2015';
    if (client.links[0].rel.indexOf('v2014') !== -1) {
      schema = 'v2014';
    }
    // TODO: add client into dedicated collection
    client.clientDetails = hc.api('client').getClient(client.globalClientId, schema);
    client.clientDetails.schema = schema;
  }
  self.added('localGlobalHouseholds', household.genericHouseholdId, household);

  return self.ready();
});
