import { Mongo } from 'meteor/mongo';

// client-side collection for client tags data
export const ClientTags = Meteor.isClient ? new Mongo.Collection('clientTags') : undefined;
