import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.publish('globalProjects.all', function publishAllGlobalProjects() {
  logger.info(`PUB[${this.userId}]: globalProjects.all`);
  if (!this.userId) {
    return [];
  }

  const hc = HmisClient.create(this.userId);
  const projects = hc.api('global').getGlobalProjects();
  projects.map(p => this.added('globalProjects', p.id, p));
  return this.ready();
});
