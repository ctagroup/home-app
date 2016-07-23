/**
 * Created by udit on 12/12/15.
 */

// Set up login services
Meteor.startup(
  () => {
    // Add Google configuration entry
    ServiceConfiguration.configurations.update(
      {
        service: 'google',
      }, {
        $set: {
          clientId: '522168810796-5sb1su89f044ra1vi64u5t9cg35e0d7u.apps.googleusercontent.com',
          client_email: 'desaiuditd@gmail.com',
          secret: 'ueekmRmJipAeyjmfeRBE2nAh',
        },
      }, {
        upsert: true,
      }
    );

    // Add HMIS configuration entry
    ServiceConfiguration.configurations.update(
      {
        service: 'HMIS',
      }, {
        $set: {
          hmisAPIEndpoints: AdminConfig.hmisAPIEndpoints,
          appId: '16631CFE-6909-4AC1-B4EB-57902AC7AF0A',
          appSecret: 'appSecret',
        },
      }, {
        upsert: true,
      }
    );
  }
);
