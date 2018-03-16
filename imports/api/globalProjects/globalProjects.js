import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const GlobalProjects = new Mongo.Collection('globalProjects');

const MemberSchema = new SimpleSchema({
  role: {
    type: String,
  },
  userId: {
    type: String,
  },
});

const ProjectMemberSchema = new SimpleSchema({
  projectId: {
    type: String,
  },
  userId: {
    type: String,
  },
});

GlobalProjects.schema = new SimpleSchema({
  agencyName: {
    type: String,
  },
  commonName: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  members: {
    type: [MemberSchema],
    optional: true,
  },
  projects: {
    type: [String],
  },
  projectsMembers: {
    type: [ProjectMemberSchema],
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

GlobalProjects.attachSchema(GlobalProjects.schema);


GlobalProjects.helpers({
  projectsWithUser(userId) {
    return (this.projectsMembers || [])
      .filter(m => m.userId === userId)
      .map(m => m.projectId);
  },
});

export default GlobalProjects;
