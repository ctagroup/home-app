import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import { docToGlobalProject } from '/imports/api/globalProjects/helpers';
// import Users from '/imports/api/users/users';
// import { userProjectGroupId } from '/imports/api/users/helpers';
// import { HmisClient } from '/imports/api/hmisApi';

Meteor.methods({
  'globalProjects.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: globalProjects.create`, doc);

    const { project, users } = docToGlobalProject(doc);

    const api = HmisClient.create(this.userId).api('global');
    const globalProject = api.createGlobalProject(project);
    api.updateGlobalProjectUsers(globalProject.id, users);

    return GlobalProjects.insert({
      ...doc,
      _id: globalProject.id,
    });
  },

  'globalProjects.update'(doc, id) {
    logger.info(`METHOD[${this.userId}]: globalProjects.update`, doc, id);
    const modifier = { $set: {
      agencyName: doc.agencyName,
      commonName: doc.commonName,
      description: doc.description,
      members: doc.members,
      projects: doc.projects,
      projectsMembers: doc.projectsMembers,
    } };
    check(modifier, GlobalProjects.schema);
    GlobalProjects.update(id, modifier);

    const { project, users } = docToGlobalProject(GlobalProjects.findOne(id));
    const api = HmisClient.create(this.userId).api('global');
    api.updateGlobalProject(id, project);
    api.updateGlobalProjectUsers(id, users);
    return id;
  },

  'globalProjects.delete'(id) {
    logger.info(`METHOD[${this.userId}]: globalProjects.delete`, id);
    const api = HmisClient.create(this.userId).api('global');
    api.deleteGlobalProject(id);
    return GlobalProjects.remove(id);
  },

});
