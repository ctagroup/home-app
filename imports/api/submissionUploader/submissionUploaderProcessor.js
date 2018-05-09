import Queue from 'better-queue';
import { logger } from '/imports/utils/logger';

export function createQueue({ jobProcessor, onJobCompleted, onJobFailed }) {
  const queue = new Queue(jobProcessor);

  queue.on('task_finish', onJobCompleted);
  queue.on('task_failed', onJobFailed);

  return queue;
}

export function onRowCompleted({ jobsStore }) {
  return (jobId, result, stats) => {
    jobsStore.succeedJob(jobId, result, stats);
  };
}

export function onRowFailed({ jobsStore }) {
  return (jobId, error, stats) => {
    logger.error(error);
    jobsStore.failJob(jobId, error.message, stats);
  };
}
