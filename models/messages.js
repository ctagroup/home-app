/**
 * Created by kavyagautam on 5/18/16.
 */

Messages = new Meteor.Collection('messages');

Schemas.Messages = new SimpleSchema(
    {
        name: {
            type: String,
            max: 256
        },
        content: {
            type: String,
            optional: true
        },

    }
);

Messages.attachSchema( Schemas.Messages );