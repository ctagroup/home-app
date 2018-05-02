import { Mongo } from 'meteor/mongo';
// import { logger } from '/imports/utils/logger';

export const RowStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  UPLOAD_SUCCESS: 'uploaded',
  UPLOAD_FAILED: 'failed',
});


const SubmissionUploaderRows = new Mongo.Collection('submissionUploaderRows');

export default SubmissionUploaderRows;
