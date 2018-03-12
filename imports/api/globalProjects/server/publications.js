import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
// import Users from '/imports/api/users/users';
// import { userProjectGroupId } from '/imports/api/users/helpers';
import GlobalProjects from '../globalProjects';

Meteor.publish('globalProjects.all', function publishAllGlobalProjects() {
  logger.info(`PUB[${this.userId}]: globalProjects.all`);
  if (!this.userId) {
    return;
  }

  const hc = HmisClient.create(this.userId);
  const projects = hc.api('global').getGlobalProjects();

  this.ready();
  projects.forEach(project => {
    this.added('globalProjects', project.id, {
      ...project,
      ...(GlobalProjects.findOne(project.id) || {}),
    });
  });
});

Meteor.publish('globalProjects.one', function publishOneGlobalProject(id) {
  logger.info(`PUB[${this.userId}]: globalProjects.one`, id);
  if (!this.userId) {
    return;
  }

  const hc = HmisClient.create(this.userId);
  const project = hc.api('global').getGlobalProject(id);
  const members = hc.api('global').getGlobalProjectUsers(id);
  console.log(members);

  this.added('globalProjects', project.id, {
    ...project,
    members,
  });
  this.ready();
});

Meteor.publish('globalProjects.active', function publishGlobalProjectsOfCurrentUser() {
  logger.info(`PUB[${this.userId}]: globalProjects.active`);

  this.ready();
  const query = {
    projectsMembers: {
      $elemMatch: {
        userId: this.userId,
      },
    },
  };
  const projectIds = GlobalProjects.find(query).fetch()
    .reduce((all, agency) => {
      const projects = agency.projectsOfUser(this.userId);
      return [...all, ...projects];
    }, []);
  return Agencies.find(query);
});
