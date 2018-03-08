import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
// import Agencies from '/imports/api/agencies/agencies';
// import Users from '/imports/api/users/users';
// import { userProjectGroupId } from '/imports/api/users/helpers';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'globalProjects.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: globalProjects.create`, doc);

    console.log(doc);

    const data = {
      ...doc,
      projects: {
        projects: doc.projects.map(projectId => ({
          projectId,
          source: 'v2015',
        })),
      },
    };
    console.log(data);

    const hc = HmisClient.create(this.userId);
    return hc.api('global').createGlobalProject(data);
  },

  'globalProjects.update'(doc, id) {
    logger.info(`METHOD[${Meteor.userId()}]: agencies.update`, doc, id);
    throw new Meteor.Error('not implemented');
    /*
    check(doc, Agencies.schema);
    return Agencies.update(id, doc);
    */
  },

});
