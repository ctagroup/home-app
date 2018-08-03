import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'globalEnrollments.create'(doc) {
    logger.info(`METHOD[${this.userId}]: globalEnrollments.create`, doc);
    const hc = HmisClient.create(this.userId);
    const result = hc.api('global').createGlobalEnrollment({
      /*
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
      */
    });
    return result.globalEnrollment.id;
  },

  'globalEnrollments.update'(doc, enrollmentId) {
    logger.info(`METHOD[${this.userId}]: globalEnrollments.update`, doc, enrollmentId);
    const hc = HmisClient.create(this.userId);
    hc.api('global').updateGlobalEnrollment(enrollmentId, {
      /*
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
      */
    });
    return true;
  },
  'globalEnrollments.delete'(enrollmentId) {
    logger.info(`METHOD[${this.userId}]: globalEnrollments.delete`, enrollmentId);
    const hc = HmisClient.create(this.userId);
    hc.api('global').deleteGlobalEnrollment(enrollmentId);
  },
});
