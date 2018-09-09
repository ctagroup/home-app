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
  getProjectsWithEnrollmentSurvey(surveyId) {
    return Object.keys(this.enrollmentSurveys).map(([key, value]) => {
      if (value && value.type) {
        return { projectId: [key.slice(1)], type: value.type, projectSchema: value.schema };
      }
      return false;
    })
    .filter(value => !!value)
    .map(({ projectId, projectSchema, type }) =>
      ['entry', 'update', 'exit'].map(enrollmentType => (
        { projectId, projectSchema, enrollmentType, surveyId: type[enrollmentType].type }
      )))
    .reduce((acc, val) => acc.concat(val), [])
    .filter(p => p.surveyId === surveyId);

    // if (surveyId === '1888eb2d-0eac-4fce-88c4-229895027541') { // Enrollment #1 survey
    //   return [
    //     {
    //       // v2017 project
    //       projectId: '43262c8c-39ac-4224-8679-e9858451831b',
    //       projectSchema: 'v2017',
    //       enrollmentType: 'entry',
    //     },
    //     {
    //       // v2017 project
    //       projectId: '43262c8c-39ac-4224-8679-e9858451831b',
    //       projectSchema: 'v2017',
    //       enrollmentType: 'update',
    //     },
    //     {
    //       // v2017 project
    //       projectId: '43262c8c-39ac-4224-8679-e9858451831b',
    //       projectSchema: 'v2017',
    //       enrollmentType: 'exit',
    //     },
    //   ];
    // }
    // return [];
  },
});

export default Agencies;
