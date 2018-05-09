import TempFiles from '/imports/api/submissionUploader/tempFiles';
import { logger } from '/imports/utils/logger';

Meteor.publishComposite('tempFiles.all', () => {
  logger.info(`PUB[${this.userId}]: files.all`);
  return {
    find() {
      return TempFiles.find();
    },
    children: [
      {
        find(file) {
          return TempFiles.Uploads.find(file.fileId);
        },
      },
    ],
  };
});
