import { HmisClient } from '/imports/api/hmis-api';

Meteor.publish('globalHouseholds', function publishHouseholds() {
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
    household.schema = 'v2015';
    if (household.links[0].rel.indexOf('v2014') !== -1) {
      household.schema = 'v2014';
    }
    self.added('localGlobalHouseholds', household.globalHouseholdId, household);
  }
  self.ready();

  // load details
  for (let i = 0; i < globalHouseholds.length && !stopFunction; i += 1) {
    const household = globalHouseholds[i];
    try {
      const client = hc.api('client').getClient(household.headOfHouseholdId, household.schema);
      client.schema = household.schema;
      // TODO: add client into dedicated collection
      household.headOfHouseholdClient = client;
      // self.added('localClients', household.headOfHouseholdId, client);
    } catch (e) {
      household.headOfHouseholdClient = { error: e.details.code };
      // self.added('localClients', household.headOfHouseholdId, { error: e.details.code });
    }

    if (household.userId) {
      // TODO: add account into dedicated collection
      try {
        household.userDetails = hc.api('user-service').getUser(household.userId).account;
      } catch (e) {
        household.userDetails = { error: e.details.code };
      }
    } else {
      household.userDetails = { error: 404 };
    }
    self.added('localGlobalHouseholds', household.globalHouseholdId, household);
  }

  return self.ready();
});


Meteor.publish('singleGlobalHousehold', function publishHousehold(globalHouseholdId) {
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
