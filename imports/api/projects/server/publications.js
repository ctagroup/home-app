import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import { HmisCache } from '/imports/api/cache/hmisCache';


Meteor.injectedPublish('projects.all', function publishAllProjects(forceReload = true) {
  const { logger, hmisClient } = this.context;
  logger.info(`PUB[${this.userId}]: projects.all`);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }

  const schemas = ['v2017', 'v2016', 'v2015', 'v2014'];
  schemas.forEach(schema => {
    const projectsForSchema = HmisCache.create(this.userId)
    .getData(`projects.all.${schema}`, () => {
      const api = hmisClient.api('client');
      const projectsWithSchema = api
        .getProjects(schema)
        .map(p => ({ ...p, schema }));
      return projectsWithSchema;
    }, forceReload);
    projectsForSchema.forEach(project => {
      this.added('localProjects', project.projectId, project);
      this.ready();
    });
  }, forceReload);

  return this.ready();
});

Meteor.injectedPublish('projects.one', function publishOneProject(id, schema) {
  const { logger, hmisClient } = this.context;
  logger.info(`PUB[${this.userId}]: projects.one`, id, schema);
  check(id, String);
  check(schema, String);
  if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
    return [];
  }
  const project = hmisClient.api('client').getProject(id, schema);
  this.added('localProjects', project.projectId, {
    ...project,
    schema,
  });
  return this.ready();
});
