import { Mongo } from 'meteor/mongo';

// Client side collection for storing eligible clients
const GlobalHouseholds = Meteor.isClient ?
  new Mongo.Collection('localGlobalHouseholds') : undefined;

export default GlobalHouseholds;
