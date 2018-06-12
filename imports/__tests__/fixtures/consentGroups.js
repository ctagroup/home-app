import ConsentGroups from '/imports/api/consentGroups/consentGroups';
import Agencies from '/imports/api/agencies/agencies';
import Users from '/imports/api/users/users';


export function loadConsentGroupsFixtures() {
  ConsentGroups.insert({
    _id: 'cg5-6',
    name: 'group for agency 5 and 6 only',
    agencies: ['agency5', 'agency6'],
  });
  ConsentGroups.insert({
    _id: 'cg2',
    name: 'group for agency 2 only',
    agencies: ['agency2'],
  });
  ConsentGroups.insert({
    _id: 'cg4',
    name: 'group for agency 4 only',
    agencies: ['agency4'],
  });
  Agencies.insert({
    _id: 'agency1',
    agencyName: 'Agency 1',
    members: ['user1'],
    projects: ['projectA1', 'projectB1'],
    projectsMembers: [
      { projectId: 'projectA1', userId: 'user1' },
    ],
  });
  Agencies.insert({
    _id: 'agency2',
    agencyName: 'Agency 2',
    members: ['user2'],
    projects: ['projectA2', 'projectB2'],
    projectsMembers: [
      { projectId: 'projectB2', userId: 'user2' },
    ],
  });
  Agencies.insert({
    _id: 'agency3',
    agencyName: 'Agency 3',
    members: ['user3'],
    projects: ['projectA3'],
    projectsMembers: [
      { projectId: 'projectA3', userId: 'user3' },
    ],
  });
  Agencies.insert({
    _id: 'agency4',
    agencyName: 'Agency 4',
    members: ['user4'],
    projects: ['projectA4', 'projectB4', 'projectC4'],
    projectsMembers: [],
  });
  Agencies.insert({
    _id: 'agency5',
    agencyName: 'Agency 5',
    members: [],
    projects: ['projectA5'],
    projectsMembers: [],
  });
  Agencies.insert({
    _id: 'agency6',
    agencyName: 'Agency 6',
    members: [],
    projects: ['projectA6'],
    projectsMembers: [],
  });
  Users.insert({
    _id: 'user1',
    activeProject: 'projectA1',
    createdAt: new Date(),
  });
  Users.insert({
    _id: 'user2',
    activeProject: 'projectB2',
    createdAt: new Date(),
  });
  Users.insert({
    _id: 'user3',
    activeProject: 'projectA3',
    createdAt: new Date(),
  });
}
