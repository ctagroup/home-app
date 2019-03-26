import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';


Meteor.publish('projects.all', function publishAllProjects() {
  logger.info(`PUB[${this.userId}]: projects.all`);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }

  const hc = HmisClient.create(this.userId);
  const api = hc.api('client');
  const schemas = ['v2017', 'v2016', 'v2015', 'v2014'];
  schemas.forEach(schema => {
    try {
      const projectsWithSchema = api.getProjects(schema).map(p => ({ ...p, schema }));
      projectsWithSchema.forEach(project => {
        this.added('localProjects', project.projectId, project);
      });
      this.ready();
    } catch (err) {
      logger.warn('cannot get projects for schema', schema);
    }
  });
  return this.ready();
});

Meteor.publish('projects.one', function publishOneProject(id, schema) {
  logger.info(`PUB[${this.userId}]: projects.one`, id, schema);
  check(id, String);
  check(schema, String);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }
  const project = HmisClient.create(this.userId).api('client').getProject(id, schema);
  this.added('localProjects', project.projectId, {
    ...project,
    schema,
  });
  return this.ready();
});
