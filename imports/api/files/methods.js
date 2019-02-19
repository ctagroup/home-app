import Files from '/imports/api/files/files';
import { logger } from '/imports/utils/logger';
import { FilesAccessRoles } from '/imports/config/permissions';

Meteor.methods({
  'files.create'(doc) {
    logger.info(`METHOD[${Meteor.userId()}]: files.create`, doc);
    check(doc, Files.schema);
    if (!Roles.userIsInRole(this.userId, FilesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    return Files.insert(doc);
  },

  'files.delete'(id) {
    logger.info(`METHOD[${Meteor.userId()}]: files.delete`, id);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, FilesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    const currentFile = Files.findOne(id);
    Files.Uploads.remove(currentFile.fileId);
    Files.remove(id);
    return;
  },
});
