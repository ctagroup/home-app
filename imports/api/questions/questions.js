import { Mongo } from 'meteor/mongo';

const Questions = new Mongo.Collection('questions');

Questions.schema = new SimpleSchema({
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
  surveyServiceQuesId: {
    type: String,
    optional: true,
  },
  locked: {
    type: Boolean,
  },
  isCopy: {
    type: Boolean,
  },
  allowSkip: {
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
});

Questions.attachSchema(Questions.schema);

export default Questions;
