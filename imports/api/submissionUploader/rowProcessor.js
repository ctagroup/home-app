import _ from 'underscore';
import { logger } from '/imports/utils/logger';
import { JobStatus } from '/imports/api/jobs/jobs';


export class ClientMatcher {
  constructor({ surveyConfig, clientApi }) {
    this.surveyConfig = surveyConfig;
    this.clientApi = clientApi;
  }

  matchRowToClient(row) {
    // for now only searching by source system id is supported
    let query = null;
    const indexOfSourceSystemId = _.findIndex(this.surveyConfig,
      column => column.type === 'clientSourceSystemId');
    if (indexOfSourceSystemId === -1) {
      logger.debug(this.surveyConfig);
      throw new Error('SourceSystemId column missing in surveyConfig');
    }
    query = row[indexOfSourceSystemId];
    const items = this.clientApi.searchClient(query, 2);
    if (items.length !== 1) {
      throw new Error(`Cannot match client using query ${query}. Found ${items.length} clients.`);
    }
    const clientId = items[0].clientId;
    logger.debug(`${query} matched as ${clientId}`);
    return clientId;
  }
}


export class ResponseMapper {
  constructor({ surveyConfig }) {
    this.surveyConfig = surveyConfig;
  }

  mapRowToResponse(row) {
    const questionResponses = row.reduce((prev, responseText, i) => {
      const column = this.surveyConfig[i];
      if (column && column.type === 'question') {
        return {
          ...prev,
          [column.questionId]: {
            questionId: column.questionId,
            responseText,
            sectionId: column.sectionId,
          },
        };
      }
      return prev;
    }, {});

    const responses = Object.keys(questionResponses).map(
      questionId => questionResponses[questionId]
    );

    return responses;
  }
}


export class SubmissionUploader {
  constructor({ surveyApi }) {
    this.surveyApi = surveyApi;
  }

  uploadSubmission(surveyId, clientId, responses) {
    const { submissionId } = this.surveyApi.createSubmission(clientId, surveyId, responses);
    return submissionId;
  }
}


export function createRowProcessor({ surveyId,
  clientMatcher, submissionMapper, submissionUploader, jobsStore }) {
  const processFn = (job, cb) => {
    try {
      jobsStore.setJobStatus(job.id, JobStatus.IN_PROGRESS);
      const row = job.data;
      const clientId = clientMatcher.matchRowToClient(row);
      const responses = submissionMapper.mapRowToResponse(row);
      const submissionId = submissionUploader.uploadSubmission(surveyId, clientId, responses);
      const result = {
        clientId,
        submissionId,
      };
      cb(null, result);
    } catch (err) {
      cb(err);
    }
  };
  return Meteor.bindEnvironment(processFn);
}
