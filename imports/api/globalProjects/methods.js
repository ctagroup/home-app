import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'globalProjects.create'(doc) {
    logger.info(`METHOD[${this.userId}]: globalProjects.create`, doc);
    const hc = HmisClient.create(this.userId);
    const result = hc.api('global').createGlobalProject({
      projectName: doc.projectName,
      projectCommonName: doc.projectCommonName,
      description: doc.description,
      sourceSystemId: '',
      projects: {
        projects: doc.projects.map(v => {
          const parts = v.split('::');
          return {
            projectId: parts[0],
            source: parts[1],
          };
        }),
      },
    });
    return result.globalProject.id;
  },
  'globalProjects.update'(doc, projectId) {
    logger.info(`METHOD[${this.userId}]: globalProjects.update`, doc, projectId);
    const hc = HmisClient.create(this.userId);
    hc.api('global').updateGlobalProject(projectId, {
      projectName: doc.projectName,
      projectCommonName: doc.projectCommonName,
      description: doc.description || '..',
      sourceSystemId: doc.sourceSystemId || '..',
      projects: {
        projects: doc.projects.map(v => {
          const parts = v.split('::');
          return {
            projectId: parts[0],
            source: parts[1],
          };
        }),
      },
    });
    return true;
  },
  'globalProjects.delete'(projectId) {
    logger.info(`METHOD[${this.userId}]: globalProjects.delete`, projectId);
    const hc = HmisClient.create(this.userId);
    hc.api('global').deleteGlobalProject(projectId);
  },
});
