/**
 * Created by udit on 13/12/15.
 */
questions = new Meteor.Collection('questions');

Schemas.questions = new SimpleSchema(
  {
    name: {
      type: String,
    },
    question: {
      type: String,
      autoform: {
        rows: 5,
      },
    },
    category: {
      type: String,
    },
    'options.$': {
      type: Object,
      optional: true,
    },
    'options.$.value': {
      type: Number,
      optional: true,
    },
    'options.$.description': {
      type: String,
      optional: true,
    },
    dataType: {
      type: String,
    },
    qtype: {
      type: String,
    },
    audience: {
      type: String,
    },
    locked: {
      type: Boolean,
    },
    isCopy: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
      label: 'Created At',
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
    updatedAt: {
      type: Date,
      label: 'Updated At',
      autoValue() {
        return new Date();
      },
      optional: true,
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

questions.attachSchema(Schemas.questions);
