import { logger } from '/imports/utils/logger';
import Agencies from '/imports/api/agencies/agencies';
import Users from '/imports/api/users/users';
import { userProjectGroupId } from '/imports/api/users/helpers';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'agencies.setUserProjectAccess'(userId, projectId, isGranted) {
    logger.info(`METHOD[${Meteor.userId()}]: agency.setUserProjectAccess`,
      userId, projectId, isGranted);

    if (isGranted) {
      Users.update(userId, { $addToSet: { projectsLinked: projectId } });
    } else {
      Users.update(userId, { $pull: { projectsLinked: projectId } });
    }
  },

  'agencies.create'(doc) {
    const user = Users.findOne(this.userId);
    const agency = {
      ...doc,
      projectGroupId: userProjectGroupId(user),
    };
    check(agency, Agencies.schema);
    return Agencies.insert(agency);
  },

  'agencies.update'(modifier, id) {
    check(modifier, Agencies.schema);
    return Agencies.update(id, modifier);
  },

});
