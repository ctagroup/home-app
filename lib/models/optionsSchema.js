/**
 * Created by udit on 26/02/16.
 */
options = new Meteor.Collection('options');

Schemas.options = new SimpleSchema(
  {
    option_name: {
      type: String,
    },
    option_value: {
      type: String,
      optional: true,
    },
  }
);

options.attachSchema(Schemas.options);
