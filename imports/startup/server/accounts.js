// Set up login services
Meteor.startup(() => {
  // Add HMIS configuration entry
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
        appId: '16631CFE-6909-4AC1-B4EB-57902AC7AF0A',
        appSecret: 'appSecret',
      },
    }, {
      upsert: true,
    }
  );
});
