import Files from '/imports/api/files/files';
import { logger } from '/imports/utils/logger';
import { FilesAccessRoles } from '/imports/config/permissions';
import eventPublisher, { UserEvent } from '/imports/api/eventLog/events';

Meteor.methods({
  'files.create'(doc) {
    logger.info(`METHOD[${this.userId}]: files.create`, doc);
    check(doc, Files.schema);
    if (!Roles.userIsInRole(this.userId, FilesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    const result = Files.insert(doc);
    eventPublisher.publish(new UserEvent(
      'files.create',
      `${result._id}`,
      { userId: this.userId, doc }
    ));
    return result;
  },

  'files.delete'(id) {
    logger.info(`METHOD[${this.userId}]: files.delete`, id);
    check(id, String);
    if (!Roles.userIsInRole(this.userId, FilesAccessRoles)) {
      throw new Meteor.Error(403, 'Forbidden');
    }
    const currentFile = Files.findOne(id);
    Files.Uploads.remove(currentFile.fileId);
    Files.remove(id);
    eventPublisher.publish(new UserEvent(
      'files.delete',
      `${id}`,
      { userId: this.userId }
    ));
    return;
  },
});
