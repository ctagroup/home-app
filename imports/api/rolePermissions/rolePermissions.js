import { Mongo } from 'meteor/mongo';

const RolePermissions = new Mongo.Collection('rolePermissions');

RolePermissions.schema = new SimpleSchema({
  roleName: {
    type: String,
  },
  permissionName: {
    type: String,
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

RolePermissions.attachSchema(RolePermissions.schema);

export default RolePermissions;
