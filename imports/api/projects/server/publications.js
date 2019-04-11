import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { HmisCache } from '/imports/api/cache/hmisCache';


Meteor.publish('projects.all', function publishAllProjects(forceReload = true) {
  logger.info(`PUB[${this.userId}]: projects.all`);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }

  const schemas = ['v2017', 'v2016', 'v2015', 'v2014'];
  schemas.forEach(schema => {
    const projectsForSchema = HmisCache.getData(`projects.all.${schema}`, this.userId, () => {
      const hc = HmisClient.create(this.userId);
      const api = hc.api('client');
      const projectsWithSchema = api
        .getProjects(schema)
        .map(p => ({ ...p, schema }));
      return projectsWithSchema;
    });
    projectsForSchema.forEach(project => {
      this.added('localProjects', project.projectId, project);
      this.ready();
    });
  }, forceReload);

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
