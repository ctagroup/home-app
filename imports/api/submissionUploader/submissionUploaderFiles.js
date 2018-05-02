import { Mongo } from 'meteor/mongo';
// import { logger } from '/imports/utils/logger';

const SubmissionUploaderFiles = new Mongo.Collection('submissionUploaderFiles');

export default SubmissionUploaderFiles;
