/**
 * Created by udit on 05/02/16.
 */
homeRoles = new Meteor.Collection('homeRoles');

Schemas.homeRoles = new SimpleSchema(
  {
    title: {
      type: String,
      unique: true,
    },
  }
);

homeRoles.attachSchema(Schemas.homeRoles);
