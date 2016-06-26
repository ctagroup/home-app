/**
 * Created by kavyagautam on 5/18/16.
 */

messages = new Meteor.Collection('messages');

Schemas.messages = new SimpleSchema(
  {
    name: {
      type: String,
      max: 256,
    },
    content: {
      type: String,
      optional: true,
    },
  }
);

messages.attachSchema(Schemas.messages);
