const DETAILED_GET_LOGS = false;

let counter = 0;
function getCorrelationId() {
  counter += 1;
  return counter;
}

export class ApiEndpoint {
  constructor(appId, accessToken, logger) {
    this.appId = appId;
    this.accessToken = accessToken;
    this.logGetDetails = DETAILED_GET_LOGS;
    this.disabledErrors = {};
    this.logger = logger;
  }

  debug(value = true) {
    this.logGetDetails = value;
    return this;
  }

  disableError(code, value = true) {
    this.disabledErrors[code] = value;
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
    const logGetRequests = true;
    const headers = this.getRequestHeaders();
    const options = {
      headers,
      correlationId: getCorrelationId(),
    };
    if (logGetRequests) {
      this.logger.debug(`HMIS API:get#${options.correlationId} (${url})`,
        this.logGetDetails ? options : ''
      );
    }

    let response = false;
    try {
      response = HTTP.get(url, options);
    } catch (err) {
      this.throwApiError('get', url, options, err, this.logGetDetails);
    }
    delete response.content;
    if (logGetRequests) {
      this.logger.debug(`HMIS API:get#${options.correlationId} res (${url})`,
        this.logGetDetails ? response : response.statusCode
      );
    }
    return response.data;
  }

  doPost(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
      correlationId: getCorrelationId(),
    };
    this.logger.debug(`HMIS API:post#${options.correlationId} ${url}`, options);
    let response = false;
    try {
      response = HTTP.post(url, options);
    } catch (err) {
      this.throwApiError('post', url, options, err);
    }
    delete response.content;
    this.logger.debug(`HMIS API:post#${options.correlationId} res (${url})`, response);
    return response.data;
  }

  doPut(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
      correlationId: getCorrelationId(),
    };
    this.logger.debug(`HMIS API:put#${options.correlationId} (${url})`, options);
    let response = false;
    try {
      response = HTTP.put(url, options);
    } catch (err) {
      this.throwApiError('put', url, options, err);
    }
    delete response.content;
    this.logger.debug(`HMIS API:put#${options.correlationId} res (${url})`, response);
    return response.data;
  }

  doDel(url) {
    const options = {
      headers: this.getRequestHeaders(),
      correlationId: getCorrelationId(),
    };
    this.logger.debug(`HMIS API:del#${options.correlationId} (${url})`, options);
    let response = false;
    try {
      response = HTTP.del(url, options);
    } catch (err) {
      this.throwApiError('del', url, options, err);
    }
    delete response.content;
    this.logger.debug(`HMIS API:del#${options.correlationId} res (${url})`, response);
    return response.data;
  }

  throwApiError(op, url, options, httpError, logDetails = true) {
    if (logDetails) {
      this.logger.error(`HMIS API:${op}#${options.correlationId} res(${url})`, {
        options,
        httpError,
      });
    } else {
      const code = httpError.response.statusCode;
      if (this.disabledErrors[code] !== true) {
        switch (code) {
          case 404:
            this.logger.warn(`HMIS API:${op}#${options.correlationId} res(${url})`, code);
            break;
          default:
            this.logger.error(`HMIS API:${op}#${options.correlationId} res(${url})`, code);
        }
      }
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
      message = `${httpError.message}` || 'An error has occurred';
    }

    if (code === 500) {
      message = 'HMIS API Server Error';
    }

    throw new Meteor.Error('hmis.api', `${message} (${code})`, { code });
  }

}
