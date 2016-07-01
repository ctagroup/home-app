/**
 * Created by Anush-PC on 5/19/2016.
 */
responses = new Meteor.Collection('responses');

Schemas.responses = new SimpleSchema(
  {

    clientID: {
      type: String,
    },
    audience: {
      type: String,
    },
    surveyID: {
      type: String,
    },
    userID: {
      type: String,
    },
    responsestatus: {
      type: String,
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
      optional: true,
    },
    'section.$.sectionID': {
      type: String,
      optional: true,
    },
    'section.$.name': {
      type: String,
      optional: true,
    },
    'section.$.skip': {
      type: Boolean,
      optional: true,
    },
    'section.$.response': {
      type: [Object],
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
