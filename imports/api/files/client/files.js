import Files from '../files';

var filesStore = new FS.Store.S3("files");

const Uploads = new FS.Collection("uploads", {
  stores: [filesStore]
});

export default Uploads;