import { Mongo } from 'meteor/mongo';


const Surveys = new Mongo.Collection('surveys');

/*
Surveys.schema = new SimpleSchema({
  title: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  copy: {
    type: Boolean,
  },
  stype: {
    type: String,
  },
  surveyCopyID: {
    type: String,
    optional: true,
  },
  locked: {
    type: Boolean,
  },
  apiSurveyServiceId: {
    type: String,
    optional: true,
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
  created: {
    type: Boolean,
  },
});

Surveys.attachSchema(Surveys.schema);
*/

export default Surveys;
