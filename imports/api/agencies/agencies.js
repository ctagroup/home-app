import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const Agencies = new Mongo.Collection('agencies');

const AgencyMemberSchema = new SimpleSchema({
  role: {
    type: String,
  },
  userId: {
    type: String,
  },
});

const ProjectMembershipSchema = new SimpleSchema({
  projectId: {
    type: String,
  },
  userId: {
    type: String,
  },
});

Agencies.schema = new SimpleSchema({
  agencyName: {
    type: String,
  },
  projectGroupId: {
    type: String,
    defaultValue: '',
  },
  members: {
    type: [AgencyMemberSchema],
    optional: true,
  },
  projects: {
    type: [String],
  },
  projectsMembers: {
    type: [ProjectMembershipSchema],
    optional: true,
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
        this.unset(); // Prevent user from supplying their own value
      }
      return val;
    },
  },
  createdBy: {
    type: String,
    optional: true,
    autoValue() {
      let val;
      if (this.isInsert) {
        val = this.userId;
      } else if (this.isUpsert) {
        val = { $setOnInsert: this.userId };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
      return val;
    },
  },
});

Agencies.attachSchema(Agencies.schema);
export default Agencies;
