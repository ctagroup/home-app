import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const Agencies = new Mongo.Collection('agencies');

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
  description: {
    type: String,
    optional: true,
  },
  projectGroupId: {
    type: String,
    defaultValue: '',
  },
  members: {
    type: [String],
  },
  projects: {
    type: [String],
  },
  projectsMembers: {
    type: [ProjectMembershipSchema],
    optional: true,
  },
  enrollmentSurveys: {
    type: Object,
    blackbox: true,
    defaultValue: {},
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

Agencies.helpers({
  projectsOfUser(userId) {
    return (this.projectsMembers || [])
      .filter(m => m.userId === userId)
      .map(m => m.projectId);
  },
  getProjectSurveyId(projectId, type) {
    const survey = Object.entries(this.enrollmentSurveys)
    .find(([key, value]) => {
      if (key.slice(7) !== projectId) return false;
      return !!value[type];
    });
    return survey && survey[1] && survey[1][type];
  },
  getProjectsWithEnrollmentSurvey(surveyId) {
    return Object.entries(this.enrollmentSurveys)
    .map(([key, value]) => {
      const [projectSchema, projectId] = key.split('::');
      return ['entry', 'update', 'exit'].map(enrollmentType => (
        { projectId, projectSchema, enrollmentType, surveyId: value[enrollmentType] }
      ));
    })
    .reduce((acc, val) => acc.concat(val), [])
    .filter(p => p.surveyId === surveyId);
  },
});

export default Agencies;
