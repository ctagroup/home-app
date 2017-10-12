import { Mongo } from 'meteor/mongo';


const Surveys = new Mongo.Collection('surveys');

SimpleSchema.debug = true;
Surveys.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  title: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  locked: {
    type: Boolean,
  },
  definition: {
    type: String,
  },
  version: {
    type: Number,
    autoValue() {
      return 2;
    },
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
  },
});

Surveys.attachSchema(Surveys.schema);

export default Surveys;
