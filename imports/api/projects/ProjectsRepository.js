class ProjectsRepository {
  constructor({ hmisClient, logger, hmisCache, userId }) {
    this.hmisClient = hmisClient;
    this.logger = logger;
    this.hmisCache = hmisCache;
    this.userId = userId;
  }

  findById(projectId) {
    // finds project by id (when schema is unknown)
    const schemas = ['v2020', 'v2017', 'v2016', 'v2015', 'v2014'];
    const project = schemas.reduce((found, schema) => {
      if (found) return found;
      try {
        return {
          ...this.hmisClient.api('client').getProject(projectId, schema),
          schema,
        };
      } catch (err) {
        return null;
      }
    }, null);
    return project;
  }
}

export default ProjectsRepository;
