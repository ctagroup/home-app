import { HmisApiRegistry } from './api-registry';
import { ApiEndpoint } from './api-endpoint';

const BASE_URL = 'https://www.hmislynk.com/global-household-api';

class GlobalHouseHoldApi extends ApiEndpoint {
  createGlobalHousehold(globalHouseholdMembers, globalHouseholdObject) {
    const url = `${BASE_URL}/global-households`;
    const body = {
      globalHouseholds: [
        globalHouseholdObject,
      ],
    };
    const household = this.doPost(url, body)[0];
    this.addMembersToHousehold(household.globalHouseholdId, globalHouseholdMembers);
    return household;
  }

  updateGlobalHousehold(globalHouseholdId, globalHouseholdObject) {
    // TODO: use new api
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
      logger.error(`Failed to update global household in HMIS. ${err.message}`);
      logger.error(err.response);
      return false;
    }
  }

  deleteGlobalHousehold(globalHouseholdID) {
    // TODO: use new api
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
      logger.error(`Failed to delete global household from HMIS. ${err.message}`);
      logger.error(err.response);
      return false;
    }
  }

  addMembersToHousehold(globalHouseholdID, globalHouseholdMembers) {
    const url = `${BASE_URL}/global-households/${globalHouseholdID}/members`;
    const body = {
      members: globalHouseholdMembers,
    };
    return this.doPost(url, body);
  }

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
      logger.error(`Failed to update members of global household in HMIS. ${err.message}`);
      logger.error(err.response);
      return false;
    }
  }

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
      logger.error(`Failed to delete global household member from HMIS. ${err.message}`);
      logger.error(err.response);
      return false;
    }
  }

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
      logger.error(`Failed to get global Household from HMIS. ${err.message}`);
      logger.error(err.response);
      return false;
    }

    return globalHouseholds;
  }

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
      logger.error(`Failed to get single household details from HMIS. ${err.message}`);
      logger.error(err.response);
      return false;
    }
  }

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
      logger.error(
        `Failed to get global household memberships for client from HMIS. ${err.message}`
      );
      logger.error(err.response);
      return false;
    }
  }

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
      logger.error(`Failed to get single household members from HMIS. ${err.message}`);
      logger.error(err.response);
      return false;
    }
  }
}

HmisApiRegistry.addApi('global-household', GlobalHouseHoldApi);
