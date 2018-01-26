import { Mongo } from 'meteor/mongo';


const Files = new Mongo.Collection('files');

Files.Uploads = new FS.Collection('uploads', {
  stores: [new FS.Store.GridFS('uploads')],
});

Files.Uploads.allow({
  download: () => {
    console.log('downloading');
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
