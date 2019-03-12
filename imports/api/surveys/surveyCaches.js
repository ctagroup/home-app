import { Mongo } from 'meteor/mongo';


const SurveyCaches = new Mongo.Collection('SurveyCaches');

SimpleSchema.debug = true;
SurveyCaches.schema = new SimpleSchema({
  title: {
    type: String,
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

SurveyCaches.attachSchema(SurveyCaches.schema);

export default SurveyCaches;
