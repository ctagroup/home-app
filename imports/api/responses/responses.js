import { Mongo } from 'meteor/mongo';

const Responses = new Mongo.Collection('responses');

export const ResponseStatus = {
  PAUSED: 'paused',
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  UPLOAD_ERROR: 'upload error',
};

Responses.schema = new SimpleSchema({
  clientId: {
    type: String,
  },
  clientSchema: {
    type: String,
    optional: true,
  },
  surveyId: {
    type: String,
  },
  surveyType: {
    type: String,
    optional: true,
  },
  surveyorId: {
    type: String,
  },
  status: {
    type: String,
  },
  submissionId: {
    type: String,
    optional: true,
  },
  globalEnrollmentId: {
    type: String,
    optional: true,
  },
  values: {
    type: Object,
    blackbox: true,
  },
  enrollmentInfo: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  // enrollmentId: {
  //   type: String,
  //   optional: true,
  // },
  // projectId: {
  //   type: String,
  //   optional: true,
  // },
  // enrollmentSchema: {
  //   type: String,
  //   allowedValues: ['v2017'],
  //   optional: true,
  // },
  // enrollmentStep: {
  //   type: String,
  //   allowedValues: ['entry', 'update', 'exit'],
  //   optional: true,
  // },
  enrollment: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  version: {
    type: Number,
    optional: true,
    autoValue() {
      if (this.isSet) return this.value;
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
  submittedAt: {
    type: Date,
    label: 'Submitted At',
    optional: true,
  },
});

Responses.attachSchema(Responses.schema);

export default Responses;
