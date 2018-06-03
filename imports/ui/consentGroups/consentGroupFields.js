import Agencies from '/imports/api/agencies/agencies';
import { consentGroupsSchema } from '/imports/api/consentGroups/consentGroups';
import './consentGroupFields.html';


export function formSchema() {
  const agencies = Agencies.find().fetch();
  const schema = { ...consentGroupsSchema };
  schema.agencies.autoform = {
    type: 'select-checkbox',
    options: () => agencies.map(a => ({
      label: a.agencyName,
      value: a._id,
    })),
  };
  return new SimpleSchema(schema);
}

/*

function userName(userId) {
  const user = Users.findOne(userId);
  if (!user) {
    return userId;
  }
  const HMIS = user.services && user.services.HMIS || {};
  return HMIS && fullName(HMIS) || user._id;
}

function projectMembersOptions(members = []) {
  return members.map(m => ({
    value: m._id,
    label: m.fullName,
  }));
}

export function formSchema(doc = {}) {
  const users = Users.find().fetch()
    .map(user => ({
      ...user,
      fullName: userName(user._id),
    }))
    .sort((a, b) => {
      if (a.fullName === b.fullName) return 0;
      return (a.fullName < b.fullName) ? -1 : 1;
    });

  const definition = {
    agencyName: {
      type: String,
    },
    description: {
      type: String,
      optional: true,
    },
    consentGroups: {
      type: [String],
      optional: true,
      autoform: {
        label: 'Consent Groups',
        type: 'tags',
        afFieldInput: {
          trimValue: true,
          typeahead: {
            source: ['groupA', 'groupB'],
          },
        },
      },
    },
    members: {
      type: [String],
      optional: true,
      label: 'Agency Members',
      autoform: {
        type: 'select-checkbox',
        options: () => users.map(u => ({
          label: u.fullName,
          value: u._id,
        })),
      },
    },
    projects: {
      type: [String],
      optional: true,
      autoform: {
        type: 'select-checkbox',
        options: () => GlobalProjects.find().fetch().map(p => ({
          label: p.projectName,
          value: p._id,
        })),
      },
    },
  };

  if (Array.isArray(doc.projects) && Array.isArray(doc.members)) {
    const members = users.filter(u => doc.members.includes(u._id));
    const selector = { _id: { $in: doc.projects } };
    const options = { sort: { projectName: 1 } };
    const projects = GlobalProjects.find(selector, options).fetch();
    projects.forEach(project => {
      const projectKey = `projectMembers._${project._id}`;
      definition[projectKey] = {
        type: [String],
        label: project.projectName,
        optional: true,
        autoform: {
          type: 'select-checkbox',
          options: projectMembersOptions(members),
        },
      };
    });
  }

  return new SimpleSchema(definition);
}

export function form2doc(doc) {
  // merge { project1: ['user1', 'user2'], project2: ['user3'] }
  // to [{projectId: project1, userId: user1}, ..., {projectId: project2, userId: user3}]
  const projectsMembers = Object.keys(doc.projectMembers || {}).reduce((all, key) => {
    const projectId = key.substring(1);
    const projectMembers = doc.projectMembers[key] || [];
    const memberships = projectMembers.map(m => ({
      projectId,
      userId: m,
    }));
    return [...all, ...memberships];
  }, []);

  return {
    agencyName: doc.agencyName,
    description: doc.description,
    consentGroups: doc.consentGroups,
    members: doc.members || [],
    projects: doc.projects || [],
    projectsMembers,
  };
}

export function doc2form(doc) {
  const projectMembers = (doc.projectsMembers || []).reduce((all, curr) => {
    const key = `_${curr.projectId}`;
    if (!all[key]) {
      return {
        ...all,
        [key]: [curr.userId],
      };
    }
    const updatedList = [...all[key], curr.userId];
    return {
      ...all,
      [key]: updatedList,
    };
  }, {});

  const form = {
    ...doc,
    projectMembers,
  };
  return form;
}

Template.agencyFields.helpers({
  showUserProjectGrid() {
    return this.doc.members && this.doc.projects
      && this.doc.members.length > 0
      && this.doc.projects.length > 0;
  },
});

Template.agencyFields.onRendered(() => console.log('inj') || Meteor.typeahead.inject());
*/
