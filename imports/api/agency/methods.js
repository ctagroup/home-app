import { logger } from '/imports/utils/logger';
import Users from '/imports/api/users/users';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'agency.setUserProjectAccess'(userId, projectId, isGranted) {
    logger.info(`METHOD[${Meteor.userId()}]: agency.setUserProjectAccess`,
      userId, projectId, isGranted);

    if (isGranted) {
      Users.update(userId, { $addToSet: { projectsLinked: projectId } });
    } else {
      Users.update(userId, { $pull: { projectsLinked: projectId } });
    }
  },
});
