import { logger } from '/imports/utils/logger';
import { userEmails } from '/imports/api/users/helpers';

Accounts.onLogin(({ user }) => {
  const adminEmails = Meteor.settings.admins || [];
  const result = userEmails(user).filter(email => adminEmails.includes(email));
  if (result.length > 0 && !Roles.userIsInRole(user._id, 'Developer')) {
    logger.info(`User ${user._id} promoted to Developer ROLE`);
    Roles.addUsersToRoles(user._id, 'Developer', Roles.GLOBAL_GROUP);
  }
});

Accounts.onCreateUser((options, user) => {
  if (options.profile && options.profile.account) {
    const { accountId } = options.profile.account;
    const updatedUser = {
      ...user,
      _id: accountId,
    };
    return updatedUser;
  }
  return user;
});

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
