/**
 * Created by pgorecki on 15.04.17.
 */

import { Mongo } from 'meteor/mongo';


// client only collection for storing HMIS clients locally
export const Clients = Meteor.isClient ? new Mongo.Collection(null) : undefined;

