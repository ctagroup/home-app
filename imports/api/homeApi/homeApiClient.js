import { logger } from '/imports/utils/logger';

let counter = 0;
function getCorrelationId() {
  counter += 1;
  return counter;
}

export default class HomeApiClient {
  constructor(userId, appId, usersCollection, settings, loggerInstance) {
    this.userId = userId;
    this.appId = appId;
    this.usersCollection = usersCollection;
    this.settings = settings;
    this.logger = loggerInstance;
  }

  absoluteUrl(relativeUrl) {
    return `${this.settings.apiUrl}${relativeUrl}`;
  }

  getRequestHeaders() {
    return {
      'X-HMIS-TrustedApp-Id': this.appId,
      'X-HOME-ApiKey': this.settings.apiKey,
      Authorization: `HMISUserAuth session_token=${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  throwApiError(op, url, options, httpError, logDetails = true) {
    if (logDetails) {
      this.logger.error(`HOME API:${op}#${options.correlationId} res(${url})`, {
        options,
        httpError,
      });
    } else {
      const code = httpError.response.statusCode;
      if (this.disabledErrors[code] !== true) {
        switch (code) {
          case 404:
            this.logger.warn(`HOME API:${op}#${options.correlationId} res(${url})`, code);
            break;
          default:
            this.logger.error(`HOME API:${op}#${options.correlationId} res(${url})`, code);
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
      message = 'HOME API Server Error';
    }

    throw new Meteor.Error('home.api', `${message} (${code})`, { code });
  }

  doGet(url) {
    const options = {
      headers: this.getRequestHeaders(),
      correlationId: getCorrelationId(),
    };
    this.logger.debug(`HOME API:get#${options.correlationId} ${url}`, options);
    let response = false;
    try {
      response = HTTP.get(url, options);
    } catch (err) {
      this.throwApiError('post', url, options, err);
    }
    delete response.content;
    this.logger.debug(`HOME API:get#${options.correlationId} res (${url})`, response);
    return response.data;
  }

  doPost(url, data) {
    const options = {
      headers: this.getRequestHeaders(),
      data,
      correlationId: getCorrelationId(),
    };
    this.logger.debug(`HOME API:post#${options.correlationId} ${url}`, options);
    let response = false;
    try {
      response = HTTP.post(url, options);
    } catch (err) {
      this.throwApiError('post', url, options, err);
    }
    delete response.content;
    this.logger.debug(`HOME API:post#${options.correlationId} res (${url})`, response);
    return response.data;
  }

  updateUserHmisCredentials() {
    const url = this.absoluteUrl('/api/v1/auth/updateCredentials/');
    const user = this.usersCollection.findOne(this.userId);
    const { accessToken, refreshToken, expiresAt } = user.services.HMIS || {};
    return this.doPost(url, {
      userId: this.userId,
      sessionToken: accessToken,
      refreshToken,
      expiresAt: Math.floor(expiresAt / 1000),
    });
  }

  static create(user) {
    return new this(user,
      Meteor.settings.appId, Meteor.users, Meteor.settings.homeApi, logger);
  }
}
