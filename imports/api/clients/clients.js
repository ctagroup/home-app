import { Mongo } from 'meteor/mongo';

// client-side collection for HMIS clients data
export const Clients = Meteor.isClient ? new Mongo.Collection('localClients') : undefined;
