import querystring from 'querystring';
import { logger as globalLogger } from '/imports/utils/logger';
import { HmisApiRegistry } from './apiRegistry';

const OAUTH_BASE_URL = 'https://www.hmislynk.com/hmis-authorization-service/rest';

export class HmisClient {
  constructor({ userId, serviceConfig, hmisApiRegistry, usersCollection, logger }) {
    this.userId = userId;
    this.serviceConfig = serviceConfig;
    this.registry = hmisApiRegistry;
    this.usersCollection = usersCollection;
    this.authData = undefined;
    this.logger = logger || globalLogger;
  }

  api(name) {
    const Cls = this.registry.getApi(name);
    if (!this.hasValidAccessToken()) {
      this.renewAccessToken();
    }
    return new Cls(this.serviceConfig.appId, this.getAccessToken(), this.logger);
  }

  getAccessToken() {
    if (!this.authData) {
      this.loadAuthData();
    }
    return this.authData.accessToken;
  }

  hasValidAccessToken() {
    if (!this.authData) {
      this.loadAuthData();
    }

    const currentTimestamp = new Date().getTime();
    const timeLeft = this.authData.expiresAt - currentTimestamp;
    // renew token 5mins before expiry
    return timeLeft > 5 * 60 * 1000;
  }

  renewAccessToken() {
    this.loadAuthData();

    let responseContent = '';
    try {
      // Request an access token
      const { appId, appSecret } = this.serviceConfig;

      const urlPath = `${OAUTH_BASE_URL}/token/`;
      const queryParams = {
        grant_type: 'refresh_token',
        refresh_token: this.authData.refreshToken,
        redirect_uri: OAuth._redirectUri('HMIS', this.serviceConfig),
      };
      const url = `${urlPath}?${querystring.stringify(queryParams)}`;

      const authorization = new Buffer(`${appId}:${appSecret}` || '');

      responseContent = HTTP.post(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': appId,
          Authorization: authorization.toString('base64'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).content;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to complete OAuth handshake with HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    const parsedResponse = JSON.parse(responseContent);
    const { accessToken, expiresIn, refreshToken } = parsedResponse.oAuthAuthorization;

    this.authData.accessToken = accessToken;
    this.authData.refreshToken = refreshToken;
    this.authData.expiresAt = new Date().getTime() + expiresIn * 1000;

    this.saveAuthData();

    return expiresIn * 1000;
  }

  loadAuthData() {
    const user = this.usersCollection.findOne({ _id: this.userId });
    if (!user) {
      throw new Meteor.Error('hmis.api', `User ${this.userId} not found`);
    }

    if (!(user.services && user.services.HMIS)) {
      throw new Meteor.Error('hmis.api', 'User does not have HMIS account');
    }
    this.authData = user.services.HMIS;
  }

  saveAuthData() {
    this.usersCollection.update(this.userId, {
      $set: {
        'services.HMIS.accessToken': this.authData.accessToken,
        'services.HMIS.expiresAt': this.authData.expiresAt,
        'services.HMIS.refreshToken': this.authData.refreshToken,
      },
    });
  }

  static create(userId) {
    // globalLogger.warn(`
    //   creating HMIS client via create() is deprecated.
    //   Use method/publication context instead
    // `);
    const serviceConfig = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!serviceConfig.appId || !serviceConfig.appSecret) {
      throw new ServiceConfiguration.ConfigError();
    }
    return new HmisClient({
      userId,
      serviceConfig,
      hmisApiRegistry: HmisApiRegistry,
      usersCollection: Meteor.users,
      logger: globalLogger,
    });
  }
}
