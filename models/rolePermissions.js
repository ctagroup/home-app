/**
 * Created by udit on 09/02/16.
 */
rolePermissions = new Meteor.Collection('rolePermissions');

Schemas.rolePermissions = new SimpleSchema(
  {
    role: {
      type: String,
    },
    permission: {
      type: String,
    },
    value: {
      type: Boolean,
    },
  }
);

rolePermissions.attachSchema(Schemas.rolePermissions);
