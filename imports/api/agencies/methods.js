import { logger } from '/imports/utils/logger';
import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import Agencies from '/imports/api/agencies/agencies';
import Users from '/imports/api/users/users';
import { userProjectGroupId } from '/imports/api/users/helpers';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'agencies.create'(doc) {
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    logger.info(`METHOD[${this.userId}]: agencies.create`, doc);
    const user = Users.findOne(this.userId);
    const agency = {
      ...doc,
      projectGroupId: userProjectGroupId(user),
    };
    check(agency, Agencies.schema);
    return Agencies.insert(agency);
  },

  'agencies.update'(doc, id) {
    logger.info(`METHOD[${this.userId}]: agencies.update`, doc, id);
    if (!Roles.userIsInRole(this.userId, DefaultAdminAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    check(doc, Agencies.schema);
    return Agencies.update(id, doc);
  },

});
