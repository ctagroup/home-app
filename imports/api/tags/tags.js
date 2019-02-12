import { Mongo } from 'meteor/mongo';

// client-side collection for tags data
export const Tags = Meteor.isClient ? new Mongo.Collection('tags') : undefined;
