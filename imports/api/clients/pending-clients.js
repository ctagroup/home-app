/**
 * Created by pgorecki on 09.04.17.
 */

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


class ClientsCollection extends Mongo.Collection {
  insert(doc, callback) {
    return super.insert(doc, callback);
  }

  update(selector, modifier) {
    return super.update(selector, modifier);
  }

  remove(selector) {
    return super.remove(selector);
  }
}

export const PendingClients = new ClientsCollection('clients');

PendingClients.schema = new SimpleSchema(
  {
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
      optional: true,
    },
    lastName: {
      type: String,
    },
    suffix: {
      type: String,
      optional: true,
    },
    photo: {
      type: String,
      optional: true,
    },
    ssn: {
      type: String,
      optional: true,
    },
    dob: {
      type: Date,
      optional: true,
    },
    race: {
      type: String,
      optional: true,
    },
    ethnicity: {
      type: String,
      optional: true,
    },
    gender: {
      type: String,
      optional: true,
    },
    veteranStatus: {
      type: String,
      optional: true,
    },
    disablingConditions: {
      type: String,
      optional: true,
    },
    personalId: {
      type: String,
      optional: true,
    },
    householdId: {
      type: String,
      optional: true,
    },
    signature: {
      type: String,
      optional: true,
    },
    emailAddress: {
      type: String,
      optional: true,
    },
    phoneNumber: {
      type: String,
      optional: true,
    },
  }
);

PendingClients.attachSchema(PendingClients.schema);

PendingClients.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
