/**
 * Created by udit on 08/04/16.
 */
const querystring = require('querystring');

HMISAPI = {
  currentUserId: '',
  setCurrentUserId(userId) {
    HMISAPI.currentUserId = userId;
  },
  getCurrentUserId() {
    return HMISAPI.currentUserId;
  },
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
    if (!config) {
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
      }).content;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to complete OAuth handshake with HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    // If 'responseContent' parses as JSON, it is an error.
    // XXX which hmis error causes this behvaior?
    if (!HMISAPI.isJSON(responseContent)) {
      throw new Error(`Failed to complete OAuth handshake with HMIS. ${responseContent}`);
    }

    // Success!  Extract the hmis access token and expiration
    // time from the response
    const parsedResponse = JSON.parse(responseContent);
    const hmisAccessToken = parsedResponse.oAuthAuthorization.accessToken;
    const hmisExpires = parsedResponse.oAuthAuthorization.expiresIn;
    const hmisRefreshToken = parsedResponse.oAuthAuthorization.refreshToken;

    if (!hmisAccessToken) {
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
  getUserAccessToken(userId) {
    const user = Meteor.users.findOne({ _id: userId });
    let accessToken = '';
    if (user && user.services && user.services.HMIS
        && user.services.HMIS.accessToken && user.services.HMIS.expiresAt) {
      const expiresAt = user.services.HMIS.expiresAt;
      const currentTimestamp = new Date().getTime();

      if (expiresAt > currentTimestamp) {
        accessToken = user.services.HMIS.accessToken;
      } else if (user.services.HMIS.refreshToken) {
        const newTokens = HMISAPI.renewAccessToken(user.services.HMIS.refreshToken);
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
  getCurrentAccessToken(useCurrentUserObject = true) {
    let userId = HMISAPI.getCurrentUserId();
    if (useCurrentUserObject) {
      const user = Meteor.user();
      if (user && user._id) {
        userId = user._id;
      }
    }

    return HMISAPI.getUserAccessToken(userId);
  },
  createClient(client, schema = 'v2015') {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();

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
        // Putting otherGender as null. Confirmed with Javier. Because it's of no use as of now.
        otherGender: 'null',
        veteranStatus: client.veteranStatus,
      },
    };

    try {
      const response = HTTP.post(
        config.hmisAPIEndpoints.clientBaseUrl
        + config.hmisAPIEndpoints[schema]
        + config.hmisAPIEndpoints.clients, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
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
  getClient(clientId, schema = 'v2015', useCurrentUserObject = true) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken(useCurrentUserObject);

    const baseUrl = config.hmisAPIEndpoints.clientBaseUrl;
    const schemaPath = config.hmisAPIEndpoints[schema];
    const clientPath = config.hmisAPIEndpoints.clients + clientId;
    const urlPah = `${baseUrl}${schemaPath}${clientPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;

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
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();

    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.apiBaseUrl + apiUrl, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
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
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();

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

    logger.info(url);

    try {
      const clients = [];
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;

      const clientsReponse = response.searchResults.items;
      for (let i = 0; i < clientsReponse.length; i += 1) {
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
  getEnrollmentsForPublish(clientId, schema = 'v2015', from = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let enrollments = [];

    const baseUrl = config.hmisAPIEndpoints.clientBaseUrl;
    const schemaPath = config.hmisAPIEndpoints[schema];
    const enrollmentsPath = config.hmisAPIEndpoints.enrollments.replace('{{client_id}}', clientId);
    const urlPah = `${baseUrl}${schemaPath}${enrollmentsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?startIndex=${from}&maxItems=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      enrollments = response.enrollments;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get housing units from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return enrollments;
  },
  getEnrollmentExitsForPublish(clientId, enrollmentId, schema = 'v2015') {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let exits = [];

    const baseUrl = config.hmisAPIEndpoints.clientBaseUrl;
    const schemaPath = config.hmisAPIEndpoints[schema];
    const enrollmentsPath = config.hmisAPIEndpoints.enrollmentExits.replace(
      '{{client_id}}',
      clientId
    );
    const exitsPath = enrollmentsPath.replace('{{enrollmentId}}', enrollmentId);
    const urlPah = `${baseUrl}${schemaPath}${exitsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      exits = response.exits.exits;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get housing units from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return exits;
  },
  getHousingUnitsForPublish(page = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let housingUnits = [];

    const baseUrl = config.hmisAPIEndpoints.housingInventoryBaseUrl;
    const housingUnitsPath = config.hmisAPIEndpoints.housingUnits;
    const urlPah = `${baseUrl}${housingUnitsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?page=${page}&size=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      housingUnits = response;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get housing units from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return housingUnits;
  },
  getHousingUnitForPublish(housingUnitId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let housingUnit = false;

    const baseUrl = config.hmisAPIEndpoints.housingInventoryBaseUrl;
    const housingUnitsPath = config.hmisAPIEndpoints.housingUnit.replace(
      '{{housing_unit_uuid}}',
      housingUnitId
    );
    const urlPah = `${baseUrl}${housingUnitsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      housingUnit = response;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get housing units from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return housingUnit;
  },
  createHousingUnit(housingUnitObject) {
    const body = [];
    // stringify to find out what is coming through.
    body.push(housingUnitObject);
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    const baseUrl = config.hmisAPIEndpoints.housingInventoryBaseUrl;
    const housingUnitsPath = config.hmisAPIEndpoints.housingUnits;
    const urlPah = `${baseUrl}${housingUnitsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;
    try {
      const response = HTTP.post(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.log(response);
      return response[0];
    } catch (err) {
      logger.info(`Failed to get client info from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  updateHousingUnit(housingUnitObject) {
    const body = [];
    // stringify to find out what is coming through.
    body.push(housingUnitObject);
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    const baseUrl = config.hmisAPIEndpoints.housingInventoryBaseUrl;
    const housingUnitsPath = config.hmisAPIEndpoints.housingUnits;
    const urlPah = `${baseUrl}${housingUnitsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;
    try {
      const response = HTTP.put(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      return response[0];
    } catch (err) {
      logger.info(`Failed to get client info from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteHousingUnit(housingInventoryId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    const baseUrl = config.hmisAPIEndpoints.housingInventoryBaseUrl;
    const housingUnitsPath = config.hmisAPIEndpoints.housingUnit.replace(
      '{{housing_unit_uuid}}',
      housingInventoryId
    );
    const urlPah = `${baseUrl}${housingUnitsPath}`;
    const url = `${urlPah}`;
    try {
      const response = HTTP.del(
        url, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`Delete housing unit ${JSON.stringify(response)}`);
      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to get client info from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getGlobalHouseholdsForPublish(page = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let globalHouseholds = [];

    const baseUrl = config.hmisAPIEndpoints.globalHouseholdBaseUrl;
    const globalHouseholdPath = config.hmisAPIEndpoints.globalHouseholds;
    const urlPah = `${baseUrl}${globalHouseholdPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?page=${page}&size=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      globalHouseholds = response;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get global Household from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return globalHouseholds;
  },
  getSingleGlobalHouseholdForPublish(globalHouseholdId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    const baseUrl = config.hmisAPIEndpoints.globalHouseholdBaseUrl;
    const singleGlobalHouseholdPath = config.hmisAPIEndpoints.globalHousehold.replace(
      '{{global_household_uuid}}',
      globalHouseholdId
    );
    const urlPah = `${baseUrl}${singleGlobalHouseholdPath}`;
    const url = `${urlPah}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      return response;
    } catch (err) {
      // throw _.extend(
      //   new Error(`Failed to get single household details from HMIS. ${err.message}`),
      //   { response: err.response }
      // );
      logger.info(`Failed to get single household details from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getGlobalHouseholdMembershipsForPublish(clientId, page = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    const baseUrl = config.hmisAPIEndpoints.globalHouseholdBaseUrl;
    const globalHouseholdForClientPath = config.hmisAPIEndpoints.globalHouseholdForClient;
    const urlPah = `${baseUrl}${globalHouseholdForClientPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?clientid=${clientId}&page=${page}&size=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      return response;
    } catch (err) {
      // throw _.extend(
      //   new Error(`Failed to get single household details from HMIS. ${err.message}`),
      //   { response: err.response }
      // );
      logger.info(
        `Failed to get global household memberships for client from HMIS. ${err.message}`
      );
      logger.info(err.response);
      return false;
    }
  },
  getGlobalHouseholdMembersForPublish(globalHouseholdId, page = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    const baseUrl = config.hmisAPIEndpoints.globalHouseholdBaseUrl;
    const singleGlobalHouseholdPath = config.hmisAPIEndpoints.globalHouseholdMembers.replace(
      '{{global_household_uuid}}',
      globalHouseholdId
    );
    const urlPah = `${baseUrl}${singleGlobalHouseholdPath}`;
    const url = `${urlPah}?page=${page}&size=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      return response;
    } catch (err) {
      // throw _.extend(
      //   new Error(`Failed to get single household members from HMIS. ${err.message}`),
      //   { response: err.response }
      // );
      logger.info(`Failed to get single household members from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  postQuestionAnswer(category, data) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
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
  getClients() {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();

    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.clientBaseUrl + config.hmisAPIEndpoints.clients, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      return response.Clients.clients;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to get client info from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createGlobalHousehold(globalHouseholdMembers, globalHouseholdObject) {
    const body = {
      globalHouseholds: [
        globalHouseholdObject,
      ],
    };
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();

    logger.info(
      config.hmisAPIEndpoints.globalHouseholdBaseUrl + config.hmisAPIEndpoints.globalHouseholds
    );
    logger.info(accessToken);
    logger.info(body);

    try {
      const response = HTTP.post(
        config.hmisAPIEndpoints.globalHouseholdBaseUrl + config.hmisAPIEndpoints.globalHouseholds, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;

      logger.info(response);

      HMISAPI.addMembersToHousehold(response[0].globalHouseholdId, globalHouseholdMembers);
      return response[0];
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to create global household in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  addMembersToHousehold(globalHouseholdID, globalHouseholdMem) {
    const globalHouseholdMembers = globalHouseholdMem;
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    const globalHouseholdMembersPath = config.hmisAPIEndpoints.globalHouseholdMembers.replace(
      '{{global_household_uuid}}',
       globalHouseholdID
    );

    logger.info(config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHouseholdMembersPath);
    logger.info(accessToken);
    logger.info({ members: globalHouseholdMembers });

    try {
      const response = HTTP.post(
        config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHouseholdMembersPath, {
          data: { members: globalHouseholdMembers },
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(response);
      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to add members in global household in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteGlobalHousehold(globalHouseholdID) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    const globalHousehold = config.hmisAPIEndpoints.globalHousehold.replace(
      '{{global_household_uuid}}',
       globalHouseholdID
    );

    logger.info(config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHousehold);
    logger.info(accessToken);

    try {
      const response = HTTP.del(
        config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHousehold, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(response);
      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to delete global household from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  updateGlobalHousehold(globalHouseholdId, globalHouseholdObject) {
    const body = globalHouseholdObject;
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    const globalHousehold = config.hmisAPIEndpoints.globalHousehold.replace(
      '{{global_household_uuid}}',
      globalHouseholdId
    );

    logger.info(config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHousehold);
    logger.info(accessToken);
    logger.info(body);

    try {
      const response = HTTP.put(
        config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHousehold, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(response);
      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to update global household in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  updateMembersToHousehold(globalHouseholdID, globalHouseholdMem) {
    const globalHouseholdMembers = globalHouseholdMem;
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    const globalHouseholdMembersPath = config.hmisAPIEndpoints.globalHouseholdMembers.replace(
      '{{global_household_uuid}}',
       globalHouseholdID
    );

    logger.info(config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHouseholdMembersPath);
    logger.info(accessToken);
    logger.info({ members: globalHouseholdMembers });

    try {
      const response = HTTP.put(
        config.hmisAPIEndpoints.globalHouseholdBaseUrl + globalHouseholdMembersPath, {
          data: { members: globalHouseholdMembers },
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(JSON.stringify(response));
      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to update members of global household in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteMemberFromHousehold(globalHouseholdId, householdMembershipId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();

    const baseUrl = config.hmisAPIEndpoints.globalHouseholdBaseUrl;
    const memberPath = config.hmisAPIEndpoints.globalHouseholdMember.replace(
      '{{global_household_uuid}}',
      globalHouseholdId
    ).replace(
      '{{membership_id}}',
      householdMembershipId
    );
    const urlPath = `${baseUrl}${memberPath}`;
    const url = `${urlPath}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.del(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to delete global household member from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getProjectsForPublish(schemaVersion = 'v2015', from = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken(false);

    const baseUrl = config.hmisAPIEndpoints.clientBaseUrl;
    const schemaPath = config.hmisAPIEndpoints[schemaVersion];
    const projectsPath = config.hmisAPIEndpoints.projects;
    const urlPah = `${baseUrl}${schemaPath}${projectsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?startIndex=${from}&maxItems=${limit}`;

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      return response.projects;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to get projects from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getProjectForPublish(projectId, schemaVersion = 'v2015') {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken(false);

    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.clientBaseUrl
        + config.hmisAPIEndpoints[schemaVersion]
        + config.hmisAPIEndpoints.projects
        + projectId, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;

      return response.project;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to get project info from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createProjectSetup(projectName, projectCommonName, schemaVersion = 'v2015') {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();

    const body = {
      project: {
        projectName,
        projectCommonName,
        continuumProject: 0,
        projectType: 14, // Coordinated Assessment
        residentialAffiliation: 0,
        targetPopulation: 4,  // NA - Not Applicable
        trackingMethod: 0,
      },
    };

    try {
      const response = HTTP.post(
        config.hmisAPIEndpoints.clientBaseUrl
        + config.hmisAPIEndpoints[schemaVersion]
        + config.hmisAPIEndpoints.projects, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;

      return response.project.projectId;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to create project in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getProjectGroups(from = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let projectGroups = [];

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const projectGroupsPath = config.hmisAPIEndpoints.projectGroups;
    const urlPah = `${baseUrl}${projectGroupsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?startIndex=${from}&maxItems=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      projectGroups = response.projectgroups;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get project groups from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return projectGroups;
  },
  getUserProfiles(from = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let userProfiles = [];

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const userProfilesPath = config.hmisAPIEndpoints.userProfiles;
    const urlPah = `${baseUrl}${userProfilesPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?startIndex=${from}&maxItems=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      userProfiles = response.profiles;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get user profiles from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return userProfiles;
  },
  getRoles(from = 0, limit = 30) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let roles = [];

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const rolesPath = config.hmisAPIEndpoints.roles;
    const urlPah = `${baseUrl}${rolesPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}?startIndex=${from}&maxItems=${limit}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      roles = response.roles;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get roles from HMIS. ${err.message}`),
        { response: err.response }
      );
    }

    return roles;
  },
  createSectionScores(surveyId, clientId, sectionId, sectionScore) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { sectionScore };
    const accessToken = HMISAPI.getCurrentAccessToken();
    let globalSectionScoresPath = config.hmisAPIEndpoints.sectionScore.replace(
      '{{client_id}}', clientId
    );
    globalSectionScoresPath = globalSectionScoresPath.replace('{{survey_id}}', surveyId);
    globalSectionScoresPath = globalSectionScoresPath.replace('{{section_id}}', sectionId);
    logger.info(`Section Scores HMIS path: ${globalSectionScoresPath} `);
    logger.info(`Section Scores HMIS: ${JSON.stringify(body, null, 2)} `);
    // put a for loop and upload scores one by one. If all do not go at once.
    try {
      const response = HTTP.post(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + globalSectionScoresPath, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      return response;
    } catch (err) {
      logger.info(`Failed to save scores in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createUser(userObj) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const accountsPath = config.hmisAPIEndpoints.accounts;
    const urlPah = `${baseUrl}${accountsPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    const body = {
      account: userObj,
    };

    logger.info(url);
    logger.info(JSON.stringify(body));

    try {
      const response = HTTP.post(url, {
        data: body,
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;

      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to create user in HMIS. ${err.message}`);
      logger.info(JSON.stringify(err.response));
      return false;
    }
  },
  updateUser(userId, userObj) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const accountPath = config.hmisAPIEndpoints.account.replace(
      '{{accountId}}',
      userId
    );
    const urlPah = `${baseUrl}${accountPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    const body = {
      account: userObj,
    };

    logger.info(url);
    logger.info(JSON.stringify(body));

    try {
      const response = HTTP.put(url, {
        data: body,
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;

      logger.info(JSON.stringify(response, null, '\t'));

      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to update user in HMIS. ${err.message}`);
      logger.info(JSON.stringify(err.response));
      return false;
    }
  },
  updateUserRoles(userId, rolesObj) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const accountRolesPath = config.hmisAPIEndpoints.accountRoles.replace(
      '{{accountId}}',
      userId
    );
    const urlPah = `${baseUrl}${accountRolesPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    const body = {
      roles: {
        role: rolesObj,
      },
    };

    logger.info(url);
    logger.info(JSON.stringify(body));

    try {
      const response = HTTP.put(url, {
        data: body,
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;

      logger.info(JSON.stringify(response, null, '\t'));

      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to update user roles in HMIS. ${err.message}`);
      logger.info(JSON.stringify(err.response));
      return false;
    }
  },
  deleteUserRole(userId, roleId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken();

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const accountRolePath = config.hmisAPIEndpoints.accountRole.replace(
      '{{accountId}}',
      userId
    ).replace(
      '{{roleId}}',
      roleId
    );
    const urlPah = `${baseUrl}${accountRolePath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    logger.info(url);

    try {
      const response = HTTP.del(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;

      logger.info(JSON.stringify(response, null, '\t'));

      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to delete user role in HMIS. ${err.message}`);
      logger.info(JSON.stringify(err.response));
      return false;
    }
  },
  getUserForPublish(userId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    const baseUrl = config.hmisAPIEndpoints.userServiceBaseUrl;
    const accountPath = config.hmisAPIEndpoints.account.replace(
      '{{accountId}}',
      userId
    );
    const urlPah = `${baseUrl}${accountPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    logger.info(url);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;

      return response.account;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to get user from HMIS. ${err.message}`);
      logger.info(JSON.stringify(err.response));
      return false;
    }
  },
  createSurveyServiceQuestions(
    question, questionGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45'
  ) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { question };
    const accessToken = HMISAPI.getCurrentAccessToken();
    logger.info(`Adding a question: ${JSON.stringify(body, null, 2)} `);
    const questionPath =
      config.hmisAPIEndpoints.surveyServiceQuestions
        .replace('{{questiongroupid}}', questionGroupId);

    logger.info(config.hmisAPIEndpoints.surveyServiceBaseUrl + questionPath);
    logger.info(accessToken);

    try {
      const response = HTTP.post(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + questionPath, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      return response.question;
    } catch (err) {
      logger.info(`Failed to add question in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  updateSurveyServiceQuestion(
    question, questionId, questionGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45'
  ) {
    const body = { question };
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    // replace with questionId in the url
    let questionPath =
      config.hmisAPIEndpoints.surveyServiceQuestion.replace('{{questionid}}', questionId);
    questionPath =
      questionPath.replace('{{questiongroupid}}', questionGroupId);

    logger.info(config.hmisAPIEndpoints.surveyServiceBaseUrl + questionPath);
    logger.info(accessToken);
    try {
      const response = HTTP.put(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + questionPath, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      return response;
    } catch (err) {
      logger.info(`Failed to update question in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getSurveyServiceQuestion(questionId, questionGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45') {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    // replace with questionId in the url
    let questionPath =
      config.hmisAPIEndpoints.surveyServiceQuestion.replace('{{questionid}}', questionId);
    questionPath =
      questionPath.replace('{{questiongroupid}}', questionGroupId);
    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + questionPath, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`HMISAPI get Question: ${JSON.stringify(response)}`);
      return response.question;
    } catch (err) {
      logger.info(`Failed to get question from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteSurveyServiceQuestion(questionId, qGroupId = '95bdca23-5135-4552-9f11-819cab1aaa45') {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    let url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.surveyServiceQuestion;
    url = url.replace('{{questiongroupid}}', qGroupId);
    url = url.replace('{{questionid}}', questionId);
    logger.info(url);
    try {
      const response = HTTP.del(
        url, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`Delete question ${JSON.stringify(response)}`);
      return response;
    } catch (err) {
      logger.info(`Failed to delete question from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deletePickListGroup(pickListGroupId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    const url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.pickListGroup.replace('{{picklistgroupid}}', pickListGroupId);
    try {
      const response = HTTP.del(
        url, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`HMISAPI Delete PLG ${JSON.stringify(response)}`);
      return response;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to delete pick list group from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createPickListGroup(pickListGroup) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { pickListGroup };
    const accessToken = HMISAPI.getCurrentAccessToken();
    logger.info(`HMISAPI Create PLG : ${JSON.stringify(body, null, 2)} `);
    const url =
      config.hmisAPIEndpoints.surveyServiceBaseUrl + config.hmisAPIEndpoints.pickListGroups;
    try {
      const response = HTTP.post(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      return response.pickListGroup;
    } catch (err) {
      logger.info(`Failed to add Pick List Group in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createPickListValues(pickListGroupId, pickListValues) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { pickListValues };
    const accessToken = HMISAPI.getCurrentAccessToken();
    const url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.pickListValues.replace('{{picklistgroupid}}', pickListGroupId);
    logger.info(`HMISAPI Create PLV : ${url} - ${JSON.stringify(body, null, 2)} `);
    try {
      const response = HTTP.post(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(JSON.stringify(response, null, 2));
      return response.pickListValues;
    } catch (err) {
      logger.info(`Failed to add Pick List Values in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createSurvey(survey) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { survey };
    const accessToken = HMISAPI.getCurrentAccessToken();
    const url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.surveys;
    logger.info(`HMISAPI Create Survey : ${url} - ${JSON.stringify(body, null, 2)} `);
    try {
      const response = HTTP.post(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(JSON.stringify(response, null, 2));
      return response.survey;
    } catch (err) {
      logger.info(`Failed to add Survey in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createSection(surveySection, surveyId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { surveySection };
    const accessToken = HMISAPI.getCurrentAccessToken();
    const url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.surveySections.replace('{{surveyid}}', surveyId);
    logger.info(`HMISAPI Create Survey Section : ${url} - ${JSON.stringify(body, null, 2)} `);
    try {
      const response = HTTP.post(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(JSON.stringify(response, null, 2));
      return response.surveySection;
    } catch (err) {
      logger.info(`Failed to add Survey section in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  createSurveyQuestionMappings(surveyId, sectionId, sectionQuestionMappings) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { sectionQuestionMappings };
    const accessToken = HMISAPI.getCurrentAccessToken();
    let url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.surveyQuestions.replace('{{surveyid}}', surveyId);
    url = url.replace('{{sectionid}}', sectionId);
    logger.info(`HMISAPI Create Question Mapping : ${url} - ${JSON.stringify(body, null, 2)} `);
    try {
      const response = HTTP.post(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(JSON.stringify(response, null, 2));
      return true;
    } catch (err) {
      logger.info(`Failed to add question Mapping in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  updateHmisSurvey(surveyId, survey) {
    const body = { survey };
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    // replace with survey Id in the url
    const surveyPath =
      config.hmisAPIEndpoints.survey.replace('{{surveyid}}', surveyId);

    logger.info(config.hmisAPIEndpoints.surveyServiceBaseUrl + surveyPath);
    logger.info(accessToken);
    logger.info(JSON.stringify(body, null, 2));
    try {
      let response = HTTP.put(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + surveyPath, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      response = true;
      return response;
    } catch (err) {
      logger.info(`Failed to update survey in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  updateHmisSurveySection(surveySection, surveyId, sectionId) {
    const body = { surveySection };
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    // replace with section Id in the url
    let sectionPath =
      config.hmisAPIEndpoints.surveySection.replace('{{surveyid}}', surveyId);
    sectionPath =
      sectionPath.replace('{{sectionid}}', sectionId);

    logger.info(config.hmisAPIEndpoints.surveyServiceBaseUrl + sectionPath);
    logger.info(accessToken);
    try {
      const response = HTTP.put(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + sectionPath, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      return response;
    } catch (err) {
      logger.info(`Failed to update survey section in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getHmisSurveySections(surveyId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    // replace with questionId in the url
    const sectionPath =
      config.hmisAPIEndpoints.surveySections.replace('{{surveyid}}', surveyId);
    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + sectionPath, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`HMISAPI get sections: ${JSON.stringify(response, null, 2)}`);
      return response.surveySections.surveySections;
    } catch (err) {
      logger.info(`Failed to get sections from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getHmisSurveyQuestionMappings(surveyId, sectionId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    // replace with questionId in the url
    let questionMappingsPath =
      config.hmisAPIEndpoints.surveyQuestions.replace('{{surveyid}}', surveyId);
    questionMappingsPath = questionMappingsPath.replace('{{sectionid}}', sectionId);
    try {
      const response = HTTP.get(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + questionMappingsPath, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`HMISAPI get Question Mappings: ${JSON.stringify(response, null, 2)}`);
      return response.sectionQuestionMappings.sectionQuestionMappings;
    } catch (err) {
      logger.info(`Failed to get question from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteHmisSurveyQuestionMapping(surveyId, sectionId, questionId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    let questionMappingsPath =
      config.hmisAPIEndpoints.surveyQuestions.replace('{{surveyid}}', surveyId);
    questionMappingsPath = questionMappingsPath.replace('{{sectionid}}', sectionId);
    questionMappingsPath = questionMappingsPath.replace('{{questionid}}', questionId);
    try {
      const response = HTTP.del(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + questionMappingsPath, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`Delete survey question Mapping ${JSON.stringify(response)}`);
      return response;
    } catch (err) {
      logger.info(`Failed to delete question mapping from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteHmisSurveySection(surveyId, sectionId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    let sectionPath =
      config.hmisAPIEndpoints.surveyQuestions.replace('{{surveyid}}', surveyId);
    sectionPath = sectionPath.replace('{{sectionid}}', sectionId);
    try {
      const response = HTTP.del(
        config.hmisAPIEndpoints.surveyServiceBaseUrl + sectionPath, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`Delete survey sections ${JSON.stringify(response)}`);
      return response;
    } catch (err) {
      logger.info(`Failed to delete sections from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteQuestionMappings(surveyId, sectionId, questionIds) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = HMISAPI.getCurrentAccessToken();
    let sectionPath =
      config.hmisAPIEndpoints.surveyQuestion.replace('{{surveyid}}', surveyId);
    sectionPath = sectionPath.replace('{{sectionid}}', sectionId);
    try {
      for (let i = 0; i < questionIds.length; i += 1) {
        const url = sectionPath.replace('{{questionid}}', questionIds[i]);
        logger.info(`Deleting Mapping - ${url}`);
        const response = HTTP.del(
          config.hmisAPIEndpoints.surveyServiceBaseUrl + url, {
            headers: {
              'X-HMIS-TrustedApp-Id': config.appId,
              Authorization: `HMISUserAuth session_token=${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        ).data;
        logger.info(`Delete mappings ${JSON.stringify(response)}`);
      }
      return true;
    } catch (err) {
      logger.info(`Failed to delete mappings from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  addResponseToHmis(clientId, surveyId, appId, sectionId, questionId, responseText) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const responses = { responses: [{ questionId, responseText, sectionId, appId }] };
    const body = { responses };
    const accessToken = HMISAPI.getCurrentAccessToken();
    let url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.responses.replace('{{clientid}}', clientId);
    url = url.replace('{{surveyid}}', surveyId);
    logger.info(`HMISAPI Create Response : ${url} - ${JSON.stringify(body, null, 2)} `);
    try {
      const response = HTTP.post(
        url, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(JSON.stringify(response, null, 2));
      return response.response;
    } catch (err) {
      logger.info(`Failed to add responses in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  deleteSurveyScores(surveyId, clientId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const accessToken = HMISAPI.getCurrentAccessToken();
    let url = config.hmisAPIEndpoints.surveyServiceBaseUrl +
      config.hmisAPIEndpoints.responses.replace('{{clientid}}', clientId);
    url = url.replace('{{surveyid}}', surveyId);
    try {
      const response = HTTP.del(
        url, {
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(`HMISAPI Delete Survey Scores ${JSON.stringify(response)}`);
      return true;
    } catch (err) {
      // throw _.extend(new Error("Failed to search clients in HMIS. " + err.message),
      //                {response: err.response});
      logger.info(`Failed to delete old Survey scores from HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },
  getEligibleClientsForPublish() {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let eligibleClientList = [];

    const baseUrl = config.hmisAPIEndpoints.houseMatchingBaseUrl;
    const housingMatchPath = config.hmisAPIEndpoints.eligibleClients;
    const urlPath = `${baseUrl}${housingMatchPath}`;
    // const url = `${urlPath}?${querystring.stringify(params)}`;
    // const url = `${urlPath}?page=${page}&size=${limit}`;
    logger.info(urlPath);
    logger.info(accessToken);

    try {
      const response = HTTP.get(urlPath, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      eligibleClientList = response.content;
      const size = response.page.totalPages;
      if (size > 0) {
        for (let i = 1; i < size - 1; i += 1) {
          const url = `${urlPath}?page=${i}`;
          const resp = HTTP.get(url, {
            headers: {
              'X-HMIS-TrustedApp-Id': config.appId,
              Authorization: `HMISUserAuth session_token=${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }).data;
          eligibleClientList.push(...resp.content);
        }
      }
      logger.info(`Eligible Client Result: ${JSON.stringify(eligibleClientList)}`);
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get eligible clients from HMIS. ${err.message}`),
        { response: err.response }
      );
    }
    return eligibleClientList;
  },
  getHousingMatchForPublish() {
    // write call for matching clients.
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let housingMatchList = [];

    const baseUrl = config.hmisAPIEndpoints.houseMatchingBaseUrl;
    const housingMatchPath = config.hmisAPIEndpoints.matches;
    const urlPath = `${baseUrl}${housingMatchPath}`;
    // const url = `${urlPath}?${querystring.stringify(params)}`;
    // const url = `${urlPath}?page=${page}&size=${limit}`;
    logger.info(urlPath);
    logger.info(accessToken);

    try {
      const response = HTTP.get(urlPath, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      housingMatchList = response.content;
      const size = response.page.totalPages;
      if (size > 0) {
        for (let i = 1; i < response.page.totalPages - 1; i += 1) {
          const url = `${urlPath}?page=${i}`;
          const resp = HTTP.get(url, {
            headers: {
              'X-HMIS-TrustedApp-Id': config.appId,
              Authorization: `HMISUserAuth session_token=${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }).data;
          housingMatchList.push(...resp.content);
        }
      }
      logger.info(`House Matching Result: ${JSON.stringify(housingMatchList)}`);
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get housing matching results from HMIS. ${err.message}`),
        { response: err.response }
      );
    }
    return housingMatchList;
  },
  getReferralStatusHistory(clientId) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    const accessToken = this.getCurrentAccessToken(false);

    let history = [];

    const baseUrl = config.hmisAPIEndpoints.houseMatchingBaseUrl;
    const statusPath = config.hmisAPIEndpoints.status.replace('{{clientId}}', clientId);
    const urlPah = `${baseUrl}${statusPath}`;
    // const url = `${urlPah}?${querystring.stringify(params)}`;
    const url = `${urlPah}`;

    logger.info(url);
    logger.info(accessToken);

    try {
      const response = HTTP.get(url, {
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      history = response;
      return history;
    } catch (err) {
      throw _.extend(
        new Error(`Failed to get referral status from HMIS. ${err.message}`),
        { response: err.response }
      );
    }
  },
  postHousingMatch() {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }
    const body = { };
    const accessToken = HMISAPI.getCurrentAccessToken();
    const baseUrl = config.hmisAPIEndpoints.houseMatchingBaseUrl;
    const housingMatchPath = config.hmisAPIEndpoints.matches;
    const urlPath = `${baseUrl}${housingMatchPath}`;
    logger.info(urlPath);
    logger.info(accessToken);
    try {
      const response = HTTP.post(
        urlPath, {
          data: body,
          headers: {
            'X-HMIS-TrustedApp-Id': config.appId,
            Authorization: `HMISUserAuth session_token=${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).data;
      logger.info(JSON.stringify(response, null, 2));
      return response;
    } catch (err) {
      logger.info(`Failed to post matched clients in HMIS. ${err.message}`);
      logger.info(err.response);
      return false;
    }
  },

  updateClientMatchStatus(clientId, statusCode) {
    const config = ServiceConfiguration.configurations.findOne({ service: 'HMIS' });
    if (!config) {
      throw new ServiceConfiguration.ConfigError();
    }

    logger.info(`clientid ${clientId} statusCode ${statusCode}`);
    const accessToken = this.getCurrentAccessToken(false);

    const baseUrl = config.hmisAPIEndpoints.houseMatchingBaseUrl;
    const statusPath = config.hmisAPIEndpoints.status.replace('{{clientId}}', clientId);
    const urlPah = `${baseUrl}${statusPath}`;
    const url = `${urlPah}`;
    const body = { status: statusCode };
    logger.info(url);
    logger.info(accessToken);
    logger.info(body);
    try {
      const response = HTTP.put(url, {
        data: body,
        headers: {
          'X-HMIS-TrustedApp-Id': config.appId,
          Authorization: `HMISUserAuth session_token=${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).data;
      logger.info(response);
      return response;
    } catch (err) {
      throw _.extend(
            new Error(`Failed to get referral status from HMIS. ${err.message}`),
            { response: err.response }
          );
    }
  },

};
