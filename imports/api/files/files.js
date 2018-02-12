import { Mongo } from 'meteor/mongo';
import { logger } from '/imports/utils/logger';

const Files = new Mongo.Collection('files');

// CollectionFS S3 reference: https://github.com/CollectionFS/Meteor-CollectionFS/tree/devel/packages/s3
const filesStore = new FS.Store.S3('files', {
  chunkSize: 512 * 1024,
  accessKeyId: Meteor.settings.s3config.key,
  secretAccessKey: Meteor.settings.s3config.secret,
  bucket: Meteor.settings.s3config.bucket,
});

Files.Uploads = new FS.Collection('uploads', {
  // stores: [new FS.Store.GridFS('uploads', {chunkSize: 512*1024})],
  stores: [filesStore],
});

Files.Uploads.allow({
  download: () => {
    logger.info('downloading');
    return true;
  },
  fetch: null,
  insert: () => true,
  update: () => true,
});

Files.schema = new SimpleSchema({
  fileId: {
    type: String,
  },
  clientId: {
    type: String,
  },
  clientSchema: {
    type: String,
  },
  description: {
    type: String,
  },
  awsUrl: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    optional: true,
    autoValue() {
      let val;
      if (this.isInsert) {
        val = new Date();
      } else if (this.isUpsert) {
        val = { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
      return val;
    },
  },
});

Files.attachSchema(Files.schema);

export default Files;
