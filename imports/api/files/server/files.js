import { logger } from '/imports/utils/logger';
// CollectionFS S3 reference: https://github.com/CollectionFS/Meteor-CollectionFS/tree/devel/packages/s3
const filesStore = new FS.Store.S3('files', {
  chunkSize: 512 * 1024,
  accessKeyId: Meteor.settings.s3config.key,
  secretAccessKey: Meteor.settings.s3config.secret,
  bucket: Meteor.settings.s3config.bucket,
});

const Uploads = new FS.Collection('uploads', {
  // stores: [new FS.Store.GridFS('uploads', {chunkSize: 512*1024})],
  stores: [filesStore],
});

Uploads.allow({
  download: () => {
    logger.info('downloading');
    return true;
  },
  fetch: null,
  insert: () => true,
  update: () => true,
});

export default Uploads;
