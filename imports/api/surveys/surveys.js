import { Mongo } from 'meteor/mongo';


const Surveys = new Mongo.Collection('surveys');

SimpleSchema.debug = true;
Surveys.schema = new SimpleSchema({
  title: {
    type: String,
  },
  active: {
    type: Boolean,
    label: 'Active (visible to surveyors, can collect responses)',
  },
  editable: {
    type: Boolean,
    label: 'Editable (can be edited by other administrators)',
  },
  definition: {
    type: String,
    autoform: {
      rows: 20,
    },
    custom() {
      try {
        JSON.parse(this.value);
      } catch (e) {
        return 'invalidJson';
      }
      return null;
    },
  },
  version: {
    type: Number,
    optional: true,
    autoValue() {
      return 2;
    },
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    optional: true,
    autoValue() {
      let val;
      if (this.isInsert) {
        val = new Date();
      } else if (this.isUpsert) {
        val = { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
      return val;
    },
  },
  updatedAt: {
    type: Date,
    label: 'Updated At',
    optional: true,
    autoValue() {
      let val;
      if (this.isUpdate) {
        val = new Date();
      }
      return val;
    },
  },
});

Surveys.schema.messages({
  invalidJson: 'Invalid JSON',
});

Surveys.attachSchema(Surveys.schema);

export default Surveys;
