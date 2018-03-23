import { logger } from '/imports/utils/logger';
// import Agencies from '/imports/api/agencies/agencies';
// import Users from '/imports/api/users/users';
// import { userProjectGroupId } from '/imports/api/users/helpers';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'globalProjects.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: globalProjects.create`, doc);
    /*
    const user = Users.findOne(this.userId);
    const agency = {
      ...doc,
      projectGroupId: userProjectGroupId(user),
    };
    check(agency, Agencies.schema);
    return Agencies.insert(agency);
    */
    throw new Meteor.Error('not implemented');
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
