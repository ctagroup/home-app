/**
 * Created by Kavi on 4/8/16.
 */

clientInfo = new Meteor.Collection('clientInfo');

Schemas.clientInfo = new SimpleSchema(
  {
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    suffix: {
      type: String,
      optional: true,
    },
    photo: {
      type: String,
      optional: true,
    },
    ssn: {
      type: String,
      optional: true,
    },
    dob: {
      type: Date,
      optional: true,
    },
    race: {
      type: String,
      optional: true,
    },
    ethnicity: {
      type: String,
      optional: true,
    },
    gender: {
      type: String,
      optional: true,
    },
    veteranStatus: {
      type: String,
      optional: true,
    },
    disablingConditions: {
      type: String,
      optional: true,
    },
    residencePrior: {
      type: String,
      optional: true,
    },
    entryDate: {
      type: Date,
      optional: true,
    },
    exitDate: {
      type: Date,
      optional: true,
    },
    destination: {
      type: String,
      optional: true,
    },
    personalId: {
      type: String,
      optional: true,
    },
    householdId: {
      type: String,
      optional: true,
    },
    relationship: {
      type: String,
      optional: true,
    },
    location: {
      type: String,
      optional: true,
    },
    shelter: {
      type: String,
      optional: true,
    },
    signature: {
      type: String,
      optional: true,
    },
  }
);

clientInfo.attachSchema(Schemas.clientInfo);
