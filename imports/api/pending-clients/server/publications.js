import { PendingClients } from '../pending-clients';

/* eslint prefer-arrow-callback: "off" */

Meteor.publish('pendingClients', function publishAllPendingClients() {
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions to get the data
  return PendingClients.find();
});

Meteor.publish('pendingClient', function publishPendingClient(clientId) {
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions to get the data
  return PendingClients.find({ _id: clientId });
});
