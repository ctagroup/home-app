import Users from '/imports/api/users/users';
import Projects from '/imports/api/projects/projects';
import { fullName } from '/imports/api/utils';
import './agencyFields.html';

function userName(userId) {
  const user = Users.findOne(userId);
  const HMIS = user.services && user.services.HMIS || {};
  return HMIS && fullName(HMIS) || user._id;
}

function memberRoleOptions() {
  return [
    {
      value: '',
      label: 'Not a member',
    },
    {
      value: 'role1',
      label: 'Role 1',
    },
    {
      value: 'role2',
      label: 'Role 2',
    },
  ];
}

/* TODO: wait until api supports project members
function projectMembersOptions(members = []) {
  return members.map(m => ({
    value: m.userId,
    label: userName(m.userId),
  }));
}
*/

export function formSchema() {
  console.log(Projects.find().fetch());
  const definition = {
    projectName: {
      type: String,
      label: 'Agency Name',
    },
    projectCommonName: {
      type: String,
      optional: true,
      label: 'Common Name',
    },
    description: {
      type: String,
      optional: true,
      label: 'Description',
    },
    members: {
      type: Object,
      optional: true,
      label: 'Agency Members',
    },
    projects: {
      type: [String],
      optional: true,
      autoform: {
        type: 'select-checkbox',
        options: () => Projects.find().fetch().map(p => ({
          label: p.projectName,
          value: p._id,
        })),
      },
    },
  };

  const users = Users.find({}, { limit: 2 }).fetch()
    .map(user => ({
      ...user,
      fullName: userName(user._id),
    }))
    .sort((a, b) => {
      if (a.fullName === b.fullName) return 0;
      return (a.fullName < b.fullName) ? -1 : 1;
    });

  users.forEach(user => {
    definition[`members._${user._id}`] = {
      type: String,
      optional: true,
      autoform: {
        options: memberRoleOptions(),
        label: user.fullName,
      },
    };
  });

  /* TODO: wait until api supports project members
  const selector = { _id: { $in: doc.projects } };
  const options = { sort: { projectName: 1 } };
  const projects = Projects.find(selector, options).fetch();
  projects.forEach(project => {
    const projectKey = `projectMembers._${project._id}`;
    definition[projectKey] = {
      type: [String],
      label: project.projectName,
      optional: true,
      autoform: {
        type: 'select-checkbox',
        options: projectMembersOptions(doc.members),
      },

    };
  });
  */

  return new SimpleSchema(definition);
}

export function form2doc(doc) {
  const members = Object.keys(doc.members || {}).map(key => {
    const userId = key.substring(1);
    return {
      userId,
      role: doc.members[key],
    };
  });
  // merge { project1: ['user1', 'user2'], project2: ['user3'] }
  // to [{projectId: project1, userId: user1}, ..., {projectId: project2, userId: user3}]
  /* TODO: wait until api supports project members
  const projectsMembers = Object.keys(doc.projectMembers || {}).reduce((all, key) => {
    const projectId = key.substring(1);
    const projectMembers = doc.projectMembers[key] || [];
    const memberships = projectMembers.map(m => ({
      projectId,
      userId: m,
    }));
    return [...all, ...memberships];
  }, []);
  */

  return {
    projectName: doc.projectName,
    projectCommonName: doc.projectCommonName,
    description: doc.description,
    members,
    projects: doc.projects || [],
    // projectsMembers, TODO: wait until api supports project members
  };
}

export function doc2form(doc) {
  const members = (doc.members || []).reduce((all, curr) => {
    const key = `_${curr.userId}`;
    return {
      ...all,
      [key]: curr.role,
    };
  }, {});

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
    members,
    projectMembers,
  };
  return form;
}
