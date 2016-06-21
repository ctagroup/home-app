/**
 * Created by udit on 20/06/16.
 */

Meteor.methods(
  {
    getHMISClient(clientId) {
      const client = HMISAPI.getClient(clientId);
      return client;
    },
  }
);
