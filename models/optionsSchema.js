/**
 * Created by udit on 26/02/16.
 */
options = new Meteor.Collection('options');

Schemas.options = new SimpleSchema(
  {
    option_name: {
      type: String,
      max: 256,
    },
    option_value: {
      type: String,
      max: 65536,
      optional: true,
    },
  }
);

options.attachSchema(Schemas.options);
