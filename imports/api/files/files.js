import { Mongo } from 'meteor/mongo';

if (Meteor.isServer) {
  import ServerUploads from '/imports/api/files/server/files';
}else{
  import ClientUploads from '/imports/api/files/client/files';
}

const Files = new Mongo.Collection('files');

Files.Uploads = Meteor.isServer ? ServerUploads : ClientUploads;

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
