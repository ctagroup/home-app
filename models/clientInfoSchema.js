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
    },
    photo: {
      type: String,
      optional: true,
    },
    ssn: {
      type: String,
    },
    dob: {
      type: Date,
    },
    race: {
      type: String,
    },
    ethnicity: {
      type: String,
    },
    gender: {
      type: String,
    },
    veteranStatus: {
      type: String,
    },
    disablingConditions: {
      type: String,
    },
    residencePrior: {
      type: String,
    },
    entryDate: {
      type: Date,
    },
    exitDate: {
      type: Date,
    },
    destination: {
      type: String,
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
    },
    location: {
      type: String,
    },
    shelter: {
      type: String,
    },
  }
);

clientInfo.attachSchema(Schemas.clientInfo);
