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

  throwApiError(url, requestHeaders, httpError) {
    logger.error('api error', {
      url,
      requestHeaders,
      httpError,
    });

    const code = httpError.response.statusCode; // string to json
    let message = '';
    try {
      const content = JSON.parse(httpError.response.content);
      message = content.errors.error[0].message;
    } catch (err) {
      message = 'An error has occurred';
    }
    throw new Meteor.Error('hmis.api', `${message} (${code})`);
  }

}

export class ApiRegistry {
  constructor() {
    this.apis = {};
  }

  addApi(name, cls) {
    this.apis[name] = cls;
  }

  getApi(name) {
    if (!this.apis.hasOwnProperty(name)) {
      throw new Meteor.Error('ApiRegistry', `Api ${name} is not registered`);
    }
    return this.apis[name];
  }
}

// Default registry for all the APIs
export const HmisApiRegistry = new ApiRegistry();
