import { Mongo } from 'meteor/mongo';
import { logger } from '/imports/utils/logger';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const JobStatus = Object.freeze({
  IDLE: 'idle',
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  SUCCESS: 'success',
  FAILED: 'failed',
});

export class JobsCollection extends Mongo.Collection {
  setJobStatus(id, status) {
    this.update(id, {
      $set: {
        status,
      },
    });
  }

  succeedJob(id, result) {
    logger.info('job succeeded', id);
    this.update(id, {
      $set: {
        status: JobStatus.SUCCESS,
        result,
      },
    });
  }

  failJob(id, errorMessage) {
    logger.error('job failed', id, errorMessage);
    this.update(id, {
      $set: {
        status: JobStatus.FAILED,
        error: {
          message: errorMessage,
        },
      },
    });
  }
}

const Jobs = new JobsCollection('jobs');
Jobs.schema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  queue: {
    type: String,
    defaultValue: 'default',
  },
  data: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  result: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: [
      JobStatus.IDLE,
      JobStatus.PENDING,
      JobStatus.IN_PROGRESS,
      JobStatus.SUCCESS,
      JobStatus.FAILED,
    ],
    defaultValue: JobStatus.IDLE,
  },
  error: {
    type: Object,
    blackbox: true,
    optional: true,
  },
});
Jobs.attachSchema(Jobs.schema);


export default Jobs;
