import { Mongo } from 'meteor/mongo';

// Client side collection for storing eligible clients
const HousingMatch = Meteor.isClient ?
  new Mongo.Collection('localHousingMatch') : undefined;

export default HousingMatch;
