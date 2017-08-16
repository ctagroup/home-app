import { PendingClients } from '../pendingClients';

/* eslint prefer-arrow-callback: "off" */

Meteor.publish('pendingClients.all', function publishAllPendingClients() {
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions to get the data
  return PendingClients.find();
});

Meteor.publish('pendingClients.one', function publishPendingClient(clientId) {
  if (!this.userId) {
    return [];
  }
  // TODO: check permissions to get the data
  return PendingClients.find({ _id: clientId });
});
