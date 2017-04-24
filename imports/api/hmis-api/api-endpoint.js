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

  doGet(url) {
    const headers = this.getRequestHeaders();
    let response = false;
    try {
      response = HTTP.get(url, { headers });
    } catch (err) {
      this.throwApiError(url, headers, err);
    }
    return response.data;
  }

  doPost(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
    };
    let response = false;
    try {
      response = HTTP.post(url, options).data;
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    return response;
  }

  doPut(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
    };
    let response = false;
    try {
      response = HTTP.put(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    return response.data;
  }

  doDel(url) {
    const options = {
      headers: this.getRequestHeaders(),
    };
    let response = false;
    try {
      response = HTTP.del(url, options);
    } catch (err) {
      this.throwApiError(url, options, err);
    }
    return response.data;
  }

  throwApiError(url, requestHeaders, httpError) {
    logger.error('api error', {
      url,
      requestHeaders,
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
