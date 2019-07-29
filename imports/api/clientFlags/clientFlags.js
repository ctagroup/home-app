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

export const ClientFlags = new ClientsCollection('clientFlags');

ClientFlags.schema = new SimpleSchema(
  {
    dedupClientId: {
      type: String,
    },
    dateSet: {
      type: Date,
    },
    userCreatorId: {
      type: String,
    },
    key: {
      type: String,
    },
    value: {
      type: Boolean,
    },
  }
);

ClientFlags.attachSchema(ClientFlags.schema);

ClientFlags.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
