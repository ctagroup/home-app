import { Mongo } from 'meteor/mongo';

// Client side collection for storing eligible clients
export const EligibleClients = Meteor.isClient ?
  new Mongo.Collection('localEligibleClients') : undefined;
