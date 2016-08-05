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
      type: String,
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
  }
);

questions.attachSchema(Schemas.questions);
