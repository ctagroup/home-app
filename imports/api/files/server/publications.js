import Files from '/imports/api/files/files';
import { logger } from '/imports/utils/logger';

Meteor.publishComposite('files.all', (clientId) => {
  logger.info(`PUB[${this.userId}]: files.all`);
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
/*
Meteor.publish('files.all', function publishFiles() {
  return Files.find();
});
*/
