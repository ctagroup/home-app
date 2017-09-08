import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Messages = new Mongo.Collection('messages');

Messages.schema = new SimpleSchema({
  name: {
    type: String,
  },
  content: {
    type: String,
    optional: true,
  },
});

Messages.attachSchema(Messages.schema);

export default Messages;

