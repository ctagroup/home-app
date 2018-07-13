import { Mongo } from 'meteor/mongo';


const HmisRoles = new Mongo.Collection('hmisRoles');
export const hmisRoleSchema = new SimpleSchema({
  id: {
    type: String,
  },
  roleName: {
    type: String,
    optional: true,
  },
  roleDescription: {
    type: String,
    optional: true,
  },
});

HmisRoles.schema = hmisRoleSchema;

HmisRoles.attachSchema(HmisRoles.schema);

export default HmisRoles;
