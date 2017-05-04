import { Mongo } from 'meteor/mongo';

// Client side collection for storing eligible clients
export const GlobalHouseholds = Meteor.isClient ?
  new Mongo.Collection('localGlobalHouseholds') : undefined;
