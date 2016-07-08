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
        let returnstatus;
        if (this.isInsert) {
          returnstatus = new Date();
        } else if (this.isUpsert) {
          returnstatus = { $setOnInsert: new Date() };
        } else {
          this.unset();  // Prevent user from supplying their own value
        }
        return returnstatus;
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
    },
    'section.$.response.$.answer': {
      type: String,
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
