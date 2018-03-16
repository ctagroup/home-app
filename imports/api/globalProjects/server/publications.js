import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
// import Users from '/imports/api/users/users';
// import { userProjectGroupId } from '/imports/api/users/helpers';
import GlobalProjects from '../globalProjects';
import { syncGlobalProjectsCollection } from '../helpers';

Meteor.publish('globalProjects.all', function publishAllGlobalProjects() {
  logger.info(`PUB[${this.userId}]: globalProjects.all`);
  if (!this.userId) {
    return null;
  }

  const hc = HmisClient.create(this.userId);
  syncGlobalProjectsCollection(hc);
  return GlobalProjects.find();
});

Meteor.publish('globalProjects.one', function publishOneGlobalProject(id) {
  logger.info(`PUB[${this.userId}]: globalProjects.one`, id);
  if (!this.userId) {
    return null;
  }
  return GlobalProjects.find(id);
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
  return GlobalProjects.find(query);
});
