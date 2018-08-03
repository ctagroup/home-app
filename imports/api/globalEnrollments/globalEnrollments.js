import { Mongo } from 'meteor/mongo';

// Client side collection for storing global enrollments
const GlobalEnrollments = Meteor.isClient ?
  new Mongo.Collection('globalEnrollments') : undefined;

export default GlobalEnrollments;
