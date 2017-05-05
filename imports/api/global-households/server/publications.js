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

  for (let i = 0; i < globalHouseholds.length && !stopFunction; i += 1) {
    const household = globalHouseholds[i];


    // TODO: add client (headOfHouseholdClient) into dedicated collection
    // self.added('localClients', household.headOfHouseholdId, client);
    hc.api('client').promiseGetClient(household.headOfHouseholdId, household.schema)
      .then((client) => {
        household.headOfHouseholdClient = client;
        household.headOfHouseholdClient.schema = household.schema;
      })
      .catch((e) => {
        household.headOfHouseholdClient = { error: e.details.code };
      })
      .then(() => {
        self.changed('localGlobalHouseholds', household.globalHouseholdId, {
          headOfHouseholdClient: household.headOfHouseholdClient,
        });
      });

    if (household.userId) {
      hc.api('user-service').promiseGetUser(household.userId)
        .then((account) => {
          household.userDetails = account;
        })
        .catch((e) => {
          household.headOfHouseholdClient = { error: e.details.code };
        })
        .then(() => {
          self.changed('localGlobalHouseholds', household.globalHouseholdId, {
            userDetails: household.userDetails,
          });
        });
    } else {
      household.userDetails = { error: 404 };
      self.changed('localGlobalHouseholds', household.globalHouseholdId, {
        userDetails: household.userDetails,
      });
    }
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
