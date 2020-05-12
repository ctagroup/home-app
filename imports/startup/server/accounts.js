import { logger } from '/imports/utils/logger';
import { userEmails } from '/imports/api/users/helpers';
import HomeApiClient from '/imports/api/homeApi/homeApiClient';

function sendUserHmisCredentialsToApi(userId) {
  try {
    const client = HomeApiClient.create(userId);
    client.updateUserHmisCredentials();
  } catch (err) {
    logger.debug('Falied to send user credentials to api');
  }
}

const sendUserHmisCredentialsToApiDebounced = _.debounce(
  Meteor.bindEnvironment((userId) => sendUserHmisCredentialsToApi(userId)),
  100
);

Accounts.onLogin(({ user }) => {
  const adminEmails = Meteor.settings.admins || [];
  const result = userEmails(user).filter((email) =>
    adminEmails.includes(email)
  );
  if (result.length > 0 && !Roles.userIsInRole(user._id, 'Developer')) {
    logger.info(`User ${user._id} promoted to Developer ROLE`);
    Roles.addUsersToRoles(user._id, 'Developer', Roles.GLOBAL_GROUP);
  }

  if (Meteor.settings.homeApi) {
    sendUserHmisCredentialsToApi(user);
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
      },
      {
        $set: {
          hmisAPIEndpoints: {
            oauthBaseUrl:
              'https://api.hslynk.com/hmis-authorization-service/rest',
            userServiceBaseUrl: 'https://api.hslynk.com/hmis-user-service/rest',
            authorize: '/authorize/',
            token: '/token/',
            selfBasicInfo: '/accounts/self/basicinfo',
          },
          appId: Meteor.settings.appId,
          appSecret: Meteor.settings.appSecret,
        },
      },
      {
        upsert: true,
      }
    );
  } else {
    throw new Error(
      'Configuration error: appId and appSecret must exist in Meteor.settings'
    );
  }

  if (Meteor.settings.homeApi) {
    Meteor.users.find().observeChanges({
      changed(userId, fields) {
        try {
          if (fields.services.HMIS.accessToken) {
            logger.info('updating credentials for user', userId);
            sendUserHmisCredentialsToApiDebounced(userId);
          }
        } catch (err) {
          // no-op
        }
      },
    });
  }
});
