import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
// import Users from '/imports/api/users/users';
// import { userProjectGroupId } from '/imports/api/users/helpers';
// import Agencies from '../agencies';

Meteor.publish('globalProjects.all', function publishAllGlobalProjects() {
  logger.info(`PUB[${this.userId}]: globalProjects.all`);
  if (!this.userId) {
    return [];
  }

  const hc = HmisClient.create(this.userId);
  const projects = hc.api('global').getGlobalProjects();

  this.ready();
  projects.forEach(project => {
    this.added('globalProjects', project.id, project);
  });

  return this.ready();
  // TODO: check permissions

  // const user = Users.findOne(this.userId);
  // const projectGroupId = userProjectGroupId(user);

  // return Agencies.find({ projectGroupId });
});

Meteor.publish('globalProjects.one', function publishOneGlobalProject(id) {
  logger.info(`PUB[${this.userId}]: globalProjects.one`, id);
  if (!this.userId) {
    return [];
  }

  return null;

  // TODO: check permissions

  // return Agencies.find(id);
});

Meteor.publish('globalProjects.active', function publishGlobalProjectsOfCurrentUser() {
  logger.info(`PUB[${this.userId}]: globalProjects.active`);
  return this.ready();
  /*
  const query = {
    projectsMembers: {
      $elemMatch: {
        userId: this.userId,
      },
    },
  };
  /*
  const projectIds = Agencies.find(query).fetch()
    .reduce((all, agency) => {
      const projects = agency.projectsOfUser(this.userId);
      return [...all, ...projects];
    }, []);
  */
  //return Agencies.find(query);
});
