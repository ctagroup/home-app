import { logger } from '/imports/utils/logger';

export class ApiEndpoint {
  constructor(appId, accessToken) {
    this.appId = appId;
    this.accessToken = accessToken;
  }

  getRequestHeaders() {
    return {
      'X-HMIS-TrustedApp-Id': this.appId,
      Authorization: `HMISUserAuth session_token=${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  promisedGet(url) {
    return new Promise((resolve, reject) => {
      const headers = this.getRequestHeaders();
      const options = { headers };
      logger.debug('HMIS API:get (promise)', { url, options });
      HTTP.get(url, options, (err, res) => {
        if (err) {
          console.log('we have an error');
          try {
            this.throwApiError(url, headers, err);
          } catch (e) {
            console.log('rejecting');
            reject(e);
          }
        } else {
          resolve(res.data);
        }
      });
    });
  }

  doGet(url) {
    const headers = this.getRequestHeaders();
    const options = { headers };
    logger.debug('HMIS API:get', { url, options });
    let response = false;
    try {
      response = HTTP.get(url, options);
    } catch (err) {
      this.throwApiError(url, headers, err);
    }
    logger.debug(`HMIS API:get response (${url})`, response);
    return response.data;
  }

  doPost(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
    };
    logger.debug('HMIS API:post', { url, options });
    let response = false;
    try {
      response = HTTP.post(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    logger.debug('HMIS API:post response (${url})', response);
    return response.data;
  }

  doPut(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
    };
    logger.debug('HMIS API:put (${url})', { url, options });
    let response = false;
    try {
      response = HTTP.put(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    logger.debug('HMIS API:put response', response);
    return response.data;
  }

  doDel(url) {
    const options = {
      headers: this.getRequestHeaders(),
    };
    logger.debug('HMIS API:del', { url, options });
    let response = false;
    try {
      response = HTTP.del(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    logger.debug('HMIS API:del response (${url})', response);
    return response.data;
  }

  throwApiError(url, requestHeaders, httpError) {
    logger.error('HMIS API', {
      url,
      requestHeaders,
      json_data: requestHeaders.data ? JSON.stringify(requestHeaders.data) : '',
      httpError,
    });
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
