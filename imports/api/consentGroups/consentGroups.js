import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Agencies from '/imports/api/agencies/agencies';

export const ConsentGroupStatus = Object.freeze({
  NEW: 'new',
  ACTIVE: 'active',
});

export const consentGroupsSchema = {
  name: {
    label: 'Name',
    type: String,
  },
  description: {
    label: 'Description',
    type: String,
    optional: true,
  },
  agencies: {
    type: [String],
  },
  status: {
    type: String,
    defaultValue: ConsentGroupStatus.NEW,
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
};

const ConsentGroups = new Mongo.Collection('consentGroups');

ConsentGroups.schema = new SimpleSchema(consentGroupsSchema);

ConsentGroups.attachSchema(ConsentGroups.schema);


ConsentGroups.helpers({
  getAllProjects() {
    const agencies = Agencies.find({ _id: { $in: this.agencies } }).fetch();
    const projectsWithDuplicates = agencies.reduce(
      (all, agency) => ([...all, ...agency.projects]),
      []
    );
    return _.uniq(projectsWithDuplicates);
  },
});

export default ConsentGroups;
