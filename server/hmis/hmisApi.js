/**
 * Created by udit on 08/04/16.
 */
const querystring = require('querystring');

HMISAPI = {
  isJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  renewAccessToken(refreshToken) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (! config) {
      throw new ServiceConfiguration.ConfigError();
    }

    let responseContent = '';
    try {
      // Request an access token
      const urlPath = `${config.hmisAPIEndpoints.oauthBaseUrl}${config.hmisAPIEndpoints.token}`;
      const queryParams = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: OAuth._redirectUri('HMIS', config),
      };

      const url = `${urlPath}?${querystring.stringify(queryParams)}`;
      const authorization = new Buffer(`${config.appId}:${config.appSecret}` || '');

      responseContent = HTTP.post(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: authorization.toString('base64'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        npmRequestOptions: {
          rejectUnauthorized: false, // TODO remove when deploy
        },
      }).content;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to complete OAuth handshake with HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    // If 'responseContent' parses as JSON, it is an error.
    // XXX which hmis error causes this behvaior?
    if (! this.isJSON(responseContent)) {
      throw new Error(`Failed to complete OAuth handshake with HMIS. ${responseContent}`);
    }

    // Success!  Extract the hmis access token and expiration
    // time from the response
    const parsedResponse = JSON.parse(responseContent);
    const hmisAccessToken = parsedResponse.oAuthAuthorization.accessToken;
    const hmisExpires = parsedResponse.oAuthAuthorization.expiresIn;
    const hmisRefreshToken = parsedResponse.oAuthAuthorization.refreshToken;

    if (! hmisAccessToken) {
      throw new Error(
        /* eslint-disable */
        `Failed to complete OAuth handshake with hmis -- can\'t find access token in HTTP response. ${responseContent}`
        /* eslint-enable */
      );
    }
    return {
      accessToken: hmisAccessToken,
      expiresAt: hmisExpires,
      refreshToken: hmisRefreshToken,
    };
  },
  getCurrentAccessToken() {
    const user = Meteor.user();
    let accessToken = '';
    if (user && user.services && user.services.HMIS
        && user.services.HMIS.accessToken && user.services.HMIS.expiresAt) {
      const expiresAt = user.services.HMIS.expiresAt;
      const currentTimestamp = new Date().getTime();

      if (expiresAt > currentTimestamp) {
        accessToken = user.services.HMIS.accessToken;
      } else if (user.services.HMIS.refreshToken) {
        const newTokens = this.renewAccessToken(user.services.HMIS.refreshToken);
        Meteor.users.update(
          {
            _id: user._id,
          },
          {
            $set: {
              'services.HMIS.accessToken': newTokens.accessToken,
              'services.HMIS.expiresAt': newTokens.expiresAt,
              'services.HMIS.refreshToken': newTokens.refreshToken,
            },
          }
        );
        accessToken = newTokens.accessToken;
      } else {
        throw _.extend(new Error('No valid refresh token for HMIS.'));
      }
    } else {
      throw _.extend(new Error('No valid access token for HMIS.'));
    }
    return accessToken;
  },
  createClient(client) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (! config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    const body = {
      client: {
        firstName: client.firstName,
        middleName: client.middleName,
        lastName: client.lastName,
        nameSuffix: client.suffix,
        nameDataQuality: 1,
        ssn: client.ssn,
        ssnDataQuality: 1,
        dob: moment(client.dob).format('x'),
        dobDataQuality: 1,
        race: client.race,
        ethnicity: client.ethnicity,
        gender: client.gender,
        otherGender: 'Test', // TODO - check with Javier for what to pass in Other Gender
        veteranStatus: client.veteranStatus,
      },
    };

    try {
      const response = HTTP.post(
        config.hmisAPIEndpoints.clientBaseUrl + config.hmisAPIEndpoints.clients, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          npmRequestOptions: {
            rejectUnauthorized: false, // TODO remove when deploy
          },
        }
      ).data;

      return response.client.clientId;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to create client in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getClient(clientId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (! config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.clientBaseUrl + config.hmisAPIEndpoints.clients + clientId, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          npmRequestOptions: {
            rejectUnauthorized: false, // TODO remove when deploy
          },
        }
      ).data;

      return response.client;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to get client info from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getClientFromUrl(apiUrl) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (! config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.apiBaseUrl + apiUrl, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          npmRequestOptions: {
            rejectUnauthorized: false, // TODO remove when deploy
          },
        }
      ).data;

      return response.client;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to get client info from HMIS with URL. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  searchClient(query, limit) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (! config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    const params = {
      q: query,
      maxItems: limit,
      sort: 'firstName',
      order: 'asc',
    };

    const baseUrl = config.hmisAPIEndpoints.clientBaseUrl;
    const searchClientPath = config.hmisAPIEndpoints.searchClient;
    const urlPah = `${baseUrl}${searchClientPath}`;
    const url = `${urlPah}?${querystring.stringify(params)}`;

    try {
      const clients = [];
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        npmRequestOptions: {
          rejectUnauthorized: false, // TODO remove when deploy
        },
      }).data;

      const clientsReponse = response.searchResults.items;
      for (let i = 0; i < clientsReponse.length; i++) {
        logger.info(clientsReponse[i]);
        clients.push(clientsReponse[i]);
      }

      return clients;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to search clients in HMIS. ${err.message}`);
      logger.info(err.response);
      return [];
    }
  },
  postQuestionAnswer(category, data) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (! config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();
    let response = '';

    try {
      response = HTTP.post(
        config.hmisAPIEndpoints.clientBaseUrl + config.hmisAPIEndpoints[category], {
          data,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          npmRequestOptions: {
            rejectUnauthorized: false, // TODO remove when deploy
          },
        }
      ).data;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to post answers to HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return response;
  },
};
