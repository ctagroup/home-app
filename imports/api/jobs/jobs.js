import { Mongo } from 'meteor/mongo';
import { logger } from '/imports/utils/logger';

export const JobStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  SUCCESS: 'success',
  FAILED: 'failed',
});

export class JobsCollection extends Mongo.Collection {
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
    logger.error('job failed', id);
    this.update(id, {
      $set: {
        status: JobStatus.FAILED,
        errorMessage,
      },
    });
  }
}

const Jobs = new JobsCollection('jobs');
export default Jobs;
