import _ from 'underscore';
import Queue from 'better-queue';


export class ClientMatcher {
  constructor({ surveyConfig, hmisClientApi }) {
    this.surveyConfig = surveyConfig;
    this.hmisClientApi = hmisClientApi;
  }

  matchRowToClient(row) {
    // for now only searching by source system id is supported
    let query = null;
    const indexOfSourceSystemId = _.findIndex(this.surveyConfig,
      column => column.type === 'clientSourceSystemId');
    if (indexOfSourceSystemId !== -1) {
      query = row[indexOfSourceSystemId];
    }
    const items = this.hmisClientApi.searchClient(query, 2);
    if (items.length !== 1) {
      throw new Error(`Cannot match client using query ${query}. Found ${items.length} clients.`);
    }
    return items[0].clientId;
  }
}


export class ResponseMapper {
  constructor({ surveyConfig }) {
    this.surveyConfig = surveyConfig;
  }

  mapRowToResponse(row) {
    const questionResponses = row.reduce((prev, curr, i) => {
      const column = this.surveyConfig[i];
      if (column && column.type === 'question') {
        return {
          ...prev,
          [column.questionId]: curr,
        };
      }
      return prev;
    }, {});

    const responses = Object.keys(questionResponses).map(questionId => ({
      questionId,
      responseText: questionResponses[questionId],
    }));

    return responses;
  }
}


export class SubmissionUploader {
  constructor({ surveyConfig }) {
    this.surveyConfig = surveyConfig;
  }

  uploadSubmission(surveyId, clientId, responses) {
    return null;
  }
}


export function createQueue({ jobProcessor, onJobCompleted, onJobFailed }) {
  const queue = new Queue(jobProcessor, {
    id: '_id',
  });

  queue.on('task_finish', onJobCompleted);
  queue.on('task_failed', onJobFailed);

  return queue;
}

export function onRowCompleted({ jobsStore }) {
  return (jobId, result, stats) => {
    jobsStore.succeedJob(jobId, result);
  };
}

export function onRowFailed({ jobsStore }) {
  return (jobId, error, stats) => {
    jobsStore.failJob(jobId, error.message);
  };
}
