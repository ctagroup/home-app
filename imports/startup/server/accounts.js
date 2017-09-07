// Set up login services
Meteor.startup(() => {
  // Add HMIS configuration entry
  if (Meteor.settings.appId && Meteor.settings.appSecret) {
    ServiceConfiguration.configurations.update(
      {
        service: 'HMIS',
      }, {
        $set: {
          hmisAPIEndpoints: {
            oauthBaseUrl: 'https://www.hmislynk.com/hmis-authorization-service/rest',
            userServiceBaseUrl: 'https://www.hmislynk.com/hmis-user-service/rest',
            authorize: '/authorize/',
            token: '/token/',
            selfBasicInfo: '/accounts/self/basicinfo',
          },
          appId: Meteor.settings.appId,
          appSecret: Meteor.settings.appSecret,
        },
      }, {
        upsert: true,
      }
    );
  } else {
    throw new Error('Configuration error: appId and appSecret must exist in Meteor.settings');
  }
});
