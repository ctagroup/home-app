/**
 * Created by udit on 20/06/16.
 */

Meteor.methods(
  {
    getHMISClient(clientId) {
      let client = HMISAPI.getClient(clientId);
      return client;
    },
  }
);
