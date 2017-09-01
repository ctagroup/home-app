import { eachLimit } from 'async';
import { HmisClient } from '/imports/api/hmis-api';

Meteor.publish('globalHouseholds.list', function publishHouseholds() {
  if (!this.userId) {
    return;
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
    self.added('localGlobalHouseholds', household.globalHouseholdId, household);
  }
  self.ready();

  const clientsQueue = [];
  const usersQueue = [];
  for (let i = 0; i < globalHouseholds.length && !stopFunction; i += 1) {
    const household = globalHouseholds[i];
    clientsQueue.push({
      globalHouseholdId: household.globalHouseholdId,
      clientId: household.headOfHouseholdId,
      schema: household.schema,
    });
    if (household.userId) {
      usersQueue.push({
        globalHouseholdId: household.globalHouseholdId,
        userId: household.userId,
      });
    }
  }

  eachLimit(clientsQueue, Meteor.settings.connectionLimit, (data, callback) => {
    const { globalHouseholdId, clientId, schema } = data;
    let clientDetails;
    Meteor.defer(() => {
      try {
        clientDetails = hc.api('client').getClient(clientId, schema);
        clientDetails.schema = schema;
      } catch (e) {
        clientDetails = { error: e.reason };
      }
      self.changed('localGlobalHouseholds', globalHouseholdId, {
        headOfHouseholdClient: clientDetails,
      });
      callback();
    });
  });

  console.log(usersQueue);

  eachLimit(usersQueue, Meteor.settings.connectionLimit, (data, callback) => {
    const { globalHouseholdId, userId } = data;
    let userDetails;
    Meteor.defer(() => {
      try {
        userDetails = hc.api('user-service').getUser(userId);
      } catch (e) {
        userDetails = { error: e.reason };
      }
      self.changed('localGlobalHouseholds', globalHouseholdId, {
        userDetails,
      });
      callback();
    });
  });
});


Meteor.publish('globalHouseholds.one', function publishHousehold(globalHouseholdId) {
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
  const household = hc.api('global-household').getHousehold(globalHouseholdId);
  household.clients = hc.api('global-household').getHouseholdMembers(globalHouseholdId);

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
  self.added('localGlobalHouseholds', household.globalHouseholdId, household);

  return self.ready();
});
