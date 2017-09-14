import { logger } from '/imports/utils/logger';

const DETAILED_GET_LOGS = false;

let counter = 0;

export class ApiEndpoint {
  constructor(appId, accessToken) {
    this.appId = appId;
    this.accessToken = accessToken;
    this.logGetDetails = DETAILED_GET_LOGS;
    this.correlationId = counter++;
  }

  debug(value = true) {
    this.logGetDetails = value;
    return this;
  }

  getRequestHeaders() {
    return {
      'X-HMIS-TrustedApp-Id': this.appId,
      Authorization: `HMISUserAuth session_token=${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  doGet(url) {
    const headers = this.getRequestHeaders();
    const options = { headers };
    logger.debug(`HMIS API:get#${this.correlationId} (${url})`, this.logGetDetails ? options : '');

    let response = false;
    try {
      response = HTTP.get(url, options);
    } catch (err) {
      this.throwApiError(url, headers, err, this.logGetDetails);
    }
    delete response.content;
    logger.debug(`HMIS API:get#${this.correlationId} res (${url})`,
      this.logGetDetails ? response : response.statusCode
    );
    return response.data;
  }

  doPost(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
    };
    logger.debug(`HMIS API:post#${this.correlationId}`, { url, options });
    let response = false;
    try {
      response = HTTP.post(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    delete response.content;
    logger.debug(`HMIS API:post#${this.correlationId} res (${url})`, response);
    return response.data;
  }

  doPut(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
    };
    logger.debug(`HMIS API:put#${this.correlationId}`, { url, options });
    let response = false;
    try {
      response = HTTP.put(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    delete response.content;
    logger.debug(`HMIS API:put#${this.correlationId} res (${url})`, response);
    return response.data;
  }

  doDel(url) {
    const options = {
      headers: this.getRequestHeaders(),
    };
    logger.debug(`HMIS API:del#${this.correlationId}`, { url, options });
    let response = false;
    try {
      response = HTTP.del(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    delete response.content;
    logger.debug(`HMIS API:del#${this.correlationId} res (${url})`, response);
    return response.data;
  }

  throwApiError(url, requestHeaders, httpError, logDetails = true) {
    if (logDetails) {
      logger.error('HMIS API', {
        url,
        requestHeaders,
        json_data: requestHeaders.data ? JSON.stringify(requestHeaders.data) : '',
        httpError,
      });
    } else {
      logger.error('HMIS API', {
        url,
        statusCode: httpError.response.statusCode,
      });
    }

    const code = httpError.response ? httpError.response.statusCode : 0;
    let message = '';
    try {
      const content = JSON.parse(httpError.response.content);
      if (_.isArray(content.error)) {
        message = content.error[0].message;
      } else {
        message = content.errors.error[0].message;
      }
    } catch (err) {
      message = httpError.message || 'An error has occurred';
    }
    throw new Meteor.Error('hmis.api', `${message} (${code})`, { code });
  }

}
