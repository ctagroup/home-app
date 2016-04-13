/**
 * Created by udit on 08/04/16.
 */
HMISAPI = {
	isJSON: function (str) {
		try {
			JSON.parse(str);
			return true;
		} catch (e) {
			return false;
		}
	},
	renewAccessToken: function (refreshToken) {

		var config = ServiceConfiguration.configurations.findOne({service: 'HMIS'});
		if (!config)
			throw new ServiceConfiguration.ConfigError();

		var responseContent = '';
		try {
			// Request an access token
			responseContent = HTTP.post(
				config.hmisAPIEndpoints.oauthBaseUrl + config.hmisAPIEndpoints.token +
				"?grant_type=refresh_token" +
				"&refresh_token=" + refreshToken +
				"&redirect_uri=" + OAuth._redirectUri('HMIS', config), {
					headers: {
						"X-HMIS-TrustedApp-Id": config.appId,
						"Authorization": new Buffer(config.appId+":"+config.appSecret || '').toString('base64'),
						"Accept": "application/json",
						"Content-Type": "application/json"
					},
					npmRequestOptions: {
						rejectUnauthorized: false // TODO remove when deploy
					}
				}).content;
		} catch (err) {
			throw _.extend(new Error("Failed to complete OAuth handshake with HMIS. " + err.message),
			               {response: err.response});
		}

		// If 'responseContent' parses as JSON, it is an error.
		// XXX which hmis error causes this behvaior?
		if (!this.isJSON(responseContent)) {
			throw new Error("Failed to complete OAuth handshake with HMIS. " + responseContent);
		}

		// Success!  Extract the hmis access token and expiration
		// time from the response
		var parsedResponse = JSON.parse(responseContent);
		var hmisAccessToken = parsedResponse.oAuthAuthorization.accessToken;
		var hmisExpires = parsedResponse.oAuthAuthorization.expiresIn;
		var hmisRefreshToken = parsedResponse.oAuthAuthorization.refreshToken;

		if (!hmisAccessToken) {
			throw new Error("Failed to complete OAuth handshake with hmis " +
			                "-- can't find access token in HTTP response. " + responseContent);
		}
		return {
			accessToken: hmisAccessToken,
			expiresAt: hmisExpires,
			refreshToken: hmisRefreshToken
		};
	},
	getCurrentAccessToken: function () {
		var user = Meteor.user();
		var accessToken = '';
		if ( user && user.services && user.services.HMIS && user.services.HMIS.accessToken && user.services.HMIS.expiresAt ) {
			var expiresAt = user.services.HMIS.expiresAt;
			var currentTimestamp = new Date().getTime();

			if ( expiresAt > currentTimestamp ) {
				accessToken = user.services.HMIS.accessToken;
			} else if ( user.services.HMIS.refreshToken ) {
				var newTokens = this.renewAccessToken( user.services.HMIS.refreshToken );
				Meteor.users.update(
					{
						_id: user._id
					},
					{
						$set: {
							'services.HMIS.accessToken': newTokens.accessToken,
							'services.HMIS.expiresAt': newTokens.expiresAt,
							'services.HMIS.refreshToken': newTokens.refreshToken
						}
					}
				);
				accessToken = newTokens.accessToken;
			} else {
				throw _.extend( new Error( "No valid refresh token for HMIS." ) );
			}
		} else {
			throw _.extend( new Error( "No valid access token for HMIS." ) );
		}
		return accessToken;
	},
	getAllClients: function( query ) {

		var config = ServiceConfiguration.configurations.findOne({service: 'HMIS'});
		if (!config)
			throw new ServiceConfiguration.ConfigError();

		var clients = new Array();

		var accessToken = this.getCurrentAccessToken();

		try {
			var response = HTTP.get(
				config.hmisAPIEndpoints.clientBaseUrl + config.hmisAPIEndpoints.clients +
				"?FirstName=" + query, {
					headers: {
						"X-HMIS-TrustedApp-Id": config.appId,
						"Authorization": "HMISUserAuth session_token="+accessToken,
						"Accept": "application/json",
						"Content-Type": "application/json"
					},
					npmRequestOptions: {
						rejectUnauthorized: false // TODO remove when deploy
					}
				}).data;
		} catch (err) {
			throw _.extend(new Error("Failed to fetch identity from HMIS. " + err.message),
			               {response: err.response});
		}

		var clientsReponse = response.Clients.clients;
		for (client in clientsReponse) {
			console.log(clientsReponse[client]);
		}

		return [{name:"John", lname: 'Doe'}];
	}
};
