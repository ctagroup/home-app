/**
 * Created by Anush-PC on 5/19/2016.
 */
responses = new Meteor.Collection('responses');

Schemas.responses = new SimpleSchema(
  {

    clientID: {
      type: String,
      max: 256,
    },
    audience: {
      type: String,
      max: 256,
    },
    surveyID: {
      type: String,
      max: 256,
    },
    userID: {
      type: String,
      max: 256,
    },
    responsestatus: {
      type: String,
      max: 256,
    },
    timestamp: {
      type: Date,
      label: 'Timestamp',
      autoValue() {
        if (this.isInsert) {
          return new Date();
        }
        return null;
      },
    },
    'section.$': {
      type: [Object],
      max: 256,
      optional: true,
    },
    'section.$.sectionID': {
      type: String,
      max: 256,
      optional: true,
    },
    'section.$.name': {
      type: String,
      max: 256,
      optional: true,
    },
    'section.$.skip': {
      type: Boolean,
      optional: true,
    },
    'section.$.response': {
      type: [Object],
      max: 256,
      optional: true,
    },
    'section.$.response.$.questionID': {
      type: String,
      max: 256,
    },
    'section.$.response.$.answer': {
      type: String,
      max: 256,
    },

    // author: {
    //	type: String,
    //	regEx: SimpleSchema.RegEx.Id,
    //	autoValue: function () {
    //		if ( this.isInsert ) {
    //			return Meteor.userId();
    //		}
    //	},
    //	autoform: {
    //		options: function () {
    //			return _.map(Meteor.users.find().fetch(), function (user) {
    //				return {
    //					label: user.emails[0].address,
    //					value: user._id
    //				};
    //			} );
    //		}
    //	}
    // }

  }
);

responses.attachSchema(Schemas.responses);
