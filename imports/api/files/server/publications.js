import Files from '/imports/api/files/files';
import { logger } from '/imports/utils/logger';
import { FilesAccessRoles } from '/imports/config/permissions';

Meteor.publishComposite('files.all', (clientId) => {
  logger.info(`PUB[${this.userId}]: files.all`);
  if (!Roles.userIsInRole(this.userId, FilesAccessRoles)) {
    return [];
  }

  return {
    find() {
      if (clientId) {
        return Files.find({ clientId });
      }
      return Files.find();
    },
    children: [
      {
        find(file) {
          return Files.Uploads.find(file.fileId);
        },
      },
    ],
  };
});
