import { Mongo } from 'meteor/mongo';

// Client side collection for storing global projects
const GlobalProjects = Meteor.isClient ?
  new Mongo.Collection('globalProjects') : undefined;

export default GlobalProjects;
