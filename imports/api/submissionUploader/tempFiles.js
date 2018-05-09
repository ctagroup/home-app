import { Mongo } from 'meteor/mongo';
// import Papa from 'papaparse';
import * as Papa from 'papaparse';
import { logger } from '/imports/utils/logger';

const TempFiles = new Mongo.Collection('tempFiles');

// CollectionFS S3 reference: https://github.com/CollectionFS/Meteor-CollectionFS/tree/devel/packages/s3
// const TempFilesSettings = Meteor.isServer ? {
//   chunkSize: 512 * 1024,
//   accessKeyId: Meteor.settings.s3config.key,
//   secretAccessKey: Meteor.settings.s3config.secret,
//   bucket: Meteor.settings.s3config.bucket,
// } : {};

// const TempFilesStore = new FS.Store.S3('TempFiles', TempFilesSettings);

TempFiles.Uploads = new FS.Collection('tempUploads', {
  stores: [new FS.Store.GridFS('tempUploadsGrid', { chunkSize: 512 * 1024 })],
  // stores: [TempFilesStore],
});

var getBase64Data = function(doc, callback) {
  var buffer = new Buffer(0);
  // callback has the form function (err, res) {}
  var readStream = doc.createReadStream();
  readStream.on('data', function(chunk) {
      buffer = Buffer.concat([buffer, chunk]);
  });
  readStream.on('error', function(err) {
      callback(err, null);
  });
  readStream.on('end', function() {
      // done
      callback(null, buffer.toString('base64'));
  });
};
var getBase64DataSync = Meteor.wrapAsync(getBase64Data);

TempFiles.Uploads.allow({
  download: () => {
    logger.info('downloading');
    return true;
  },
  fetch: null,
  insert: () => true,
  update: () => true,
});


TempFiles.Uploads.on('uploaded', (fileObj) => {
  console.log('getBase64DataSync', getBase64DataSync(fileObj, (err, res) => 
    console.log('err, res', err, res)));
  // do something
  // console.log('uploaded', fileObj.name(), fileObj);
  // fileObj.on('data', () => {
  //   console.log('readable data');
  //   const data = fileObj.read();
  //   console.log(data);
  // });
  const readStream = fileObj.createReadStream('whatever.csv');
  // console.log('readStream', readStream);
  let csv = '';
  readStream.on('data', (chunk) => {
    csv += chunk.read().toString();
    console.log('readable data');
    // const data = readStream.read();
    // console.log(data);
  });
  readStream.on('readable', () => {
    console.log('readable');
    const data = readStream.read();
    console.log(data);
  });

  readStream.on('end', () => {
    console.log('THE END');
  });
  Papa.parse(readStream, {
    complete(results) {
      console.log('readStream', results);
    },
  });
  console.log('CSV', csv);
  // const getBase64Data = (doc, callback) => {
  //   let buffer = new Buffer(0);
  //   // callback has the form function (err, res) {}
  //   const readStream2 = doc.createReadStream();
  //   readStream2.on('data', () => {
  //     buffer = Buffer.concat([buffer, readStream2.read()]);
  //   });
  //   readStream2.on('error', (err) => {
  //     callback(err, null);
  //   });
  //   readStream2.on('end', () => {
  //     // done
  //     callback(null, buffer.toString('base64'));
  //   });
  // };
  // const getBase64DataSync = Meteor.wrapAsync(getBase64Data);
  // getBase64DataSync(fileObj, (err, res) => {
  //   console.log('getBase64DataSync', err, res);
  // });
});


TempFiles.schema = new SimpleSchema({
  fileId: {
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

TempFiles.attachSchema(TempFiles.schema);

export default TempFiles;
